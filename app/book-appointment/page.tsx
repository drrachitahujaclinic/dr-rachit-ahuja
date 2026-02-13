// app/book/page.tsx (or wherever your BookAppointment component lives)
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { useGoogleLogin } from "@react-oauth/google";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const formatTimeDisplay = (hhmm: string) => {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const suffix = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  if (h > 12) h = h - 12;
  return `${String(h)}:${String(m).padStart(2, "0")} ${suffix}`;
};

export default function BookAppointment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clinicParam = (searchParams?.get("clinic") || "").toLowerCase();

  const user = useAuthStore((s) => s.user);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const setRedirect = useAuthStore((s) => s.setRedirect);

  // state
  const [paymentMethod, setPaymentMethod] = useState<
    "ONLINE" | "PAY_ON_ARRIVAL"
  >("ONLINE");

  const [selectedClinic, setSelectedClinic] = useState<string>(
    clinicParam || "dehradun",
  );
  const [allowedClinics, setAllowedClinics] = useState<string[]>([
    "DEHRADUN",
    "ONLINE",
  ]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [slots, setSlots] = useState<any[]>([]);
  const [blockedInfo, setBlockedInfo] = useState<{
    blocked: boolean;
    message?: string;
  }>({ blocked: false });

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [showErrors, setShowErrors] = useState(false);

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [orderCreating, setOrderCreating] = useState(false);

  const [fee, setFee] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("INR");
  const [pricingLoading, setPricingLoading] = useState(true);
  useEffect(() => {
    const loadPricing = async () => {
      try {
        const res = (await api.get("admin/pricing")) as any;
        console.log(res);
        setFee(res?.settings.appointmentFee / 100 || null);
        setCurrency(res?.currency || "INR");
      } catch (err) {
        console.error("Failed to fetch pricing", err);
      } finally {
        setPricingLoading(false);
      }
    };
    loadPricing();
  }, []);

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(dateStr);
    selected.setHours(0, 0, 0, 0);

    return selected < today;
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    const d = new Date(dateStr);

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  // compare "HH:mm" to current time
  const isPastTimeToday = (time: string) => {
    const [hh, mm] = time.split(":").map(Number);
    const now = new Date();

    return (
      hh < now.getHours() || (hh === now.getHours() && mm <= now.getMinutes())
    );
  };

  // clinic display data
  const clinicData: any = {
    DEHRADUN: {
      name: "Shri Mahant Indiresh Hospital, Dehradun",
      location: "Dehradun",
      hours: "10:00 AM - 2:00 PM",
    },
    ROORKEE: {
      name: "Hemant Hospital, Roorkee",
      location: "Roorkee",
      hours: "2nd & 4th Thursday 10:00 AM - 2:00 PM",
    },
    ONLINE: {
      name: "Online Consultation - Google Meet",
      location: "Google Meet",
      hours: "10:00 AM - 2:00 PM",
    },
  };

  useEffect(() => {
    if (user) {
      setName((p) => p || user.name || "");
      setEmail((p) => p || user.email || "");
    }
  }, [user]);

  // Google login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await loginWithGoogle(tokenResponse.access_token);
      } catch (err) {
        console.error(err);
        toast.error("Login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const ensureSignedIn = async () => {
    if (user) return true;
    setRedirect("/book");
    googleLogin();
    return false;
  };

  // When date changes, call /clinic/check-settings and then /slots
  useEffect(() => {
    const fetchSettingsAndSlots = async () => {
      if (!selectedDate) {
        setAllowedClinics(["DEHRADUN", "ONLINE"]);
        setSlots([]);
        setBlockedInfo({ blocked: false });
        return;
      }
      if (isPastDate(selectedDate)) {
        setSlots([]);
        setBlockedInfo({
          blocked: true,
          message: "You cannot book an appointment in the past",
        });
        return;
      }

      try {
        setSlotsLoading(true);
        // 1) check settings
        const settingsRes = (await api.get(
          `/clinic/check-settings?date=${selectedDate}`,
        )) as any;
        // expected: { allowedClinics: [...], isBlocked, message }
        const allowed: string[] = settingsRes.allowedClinics || [];
        const isBlocked = settingsRes.isBlocked || false;
        const message = settingsRes.message || null;

        setAllowedClinics(allowed);
        // if selectedClinic not in allowed, pick first allowed
        if (
          !allowed
            .map((a) => a.toLowerCase())
            .includes(selectedClinic.toLowerCase())
        ) {
          setSelectedClinic((allowed[0] || "DEHRADUN").toLowerCase());
        }

        if (isBlocked) {
          setBlockedInfo({ blocked: true, message });
          setSlots([]);
          return;
        } else {
          setBlockedInfo({ blocked: false });
        }

        // 2) fetch slots for selected clinic (server will map correctly)
        // ensure clinic param is uppercase expected by server
        const clinicParamToSend = (
          selectedClinic ||
          allowed[0] ||
          "DEHRADUN"
        ).toUpperCase();
        const slotsRes = (await api.get(
          `/slots?date=${selectedDate}&clinic=${clinicParamToSend}`,
        )) as any;
        if (slotsRes && slotsRes.slots) {
          setSlots(slotsRes.slots || []);
          // If today → filter out past time slots
          if (isToday(selectedDate)) {
            const nowFiltered = slotsRes.slots.filter(
              (s: any) => !isPastTimeToday(s.startTime),
            );

            setSlots(nowFiltered);

            // If selected slot is past → clear it
            if (selectedTime && isPastTimeToday(selectedTime)) {
              setSelectedTime("");
              toast.error(
                "Selected time is in the past. Choose a future time.",
              );
            }

            // If all slots are past
            if (nowFiltered.length === 0) {
              setBlockedInfo({
                blocked: true,
                message: "No future time slots left for today",
              });
            }
          }

          // if previously selected time now unavailable, clear
          if (
            selectedTime &&
            slotsRes.slots.every(
              (s: any) => s.startTime !== selectedTime || !s.available,
            )
          ) {
            setSelectedTime("");
            toast(
              "Previously selected slot no longer available. Choose another.",
            );
          }
        } else {
          setSlots([]);
        }
      } catch (err: any) {
        console.error("fetchSettingsAndSlots", err);
        toast.error(err?.message || "Failed to fetch availability");
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSettingsAndSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedClinic]);

  // Whenever selectedClinic changes (after date selected), re-fetch slots
  useEffect(() => {
    const fetchSlotsForClinic = async () => {
      if (!selectedDate) return;
      setSlotsLoading(true);
      try {
        const clinicParamToSend = selectedClinic.toUpperCase();
        const slotsRes = (await api.get(
          `/slots?date=${selectedDate}&clinic=${clinicParamToSend}`,
        )) as any;
        if (slotsRes && slotsRes.slots) setSlots(slotsRes.slots || []);
      } catch (err: any) {
        console.error("fetchSlotsForClinic", err);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlotsForClinic();
  }, [selectedClinic]);

  const handleBooking = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setShowErrors(true);

    const ok = await ensureSignedIn();
    if (!ok) return;

    if (!selectedDate) return toast.error("Select date");
    if (!selectedTime) return toast.error("Select time");
    if (!name || !email || !phone || !age || !gender)
      return toast.error("Fill patient details");
    if (blockedInfo.blocked)
      return toast.error(blockedInfo.message || "Selected date is blocked");

    setLoading(true);

    try {
      // get-or-create patient
      const patientResp = (await api.post("/patients", {
        name,
        phone,
        gender,
        age,
      })) as any;

      const patient = patientResp.patient;
      const patientId = patient._id || patient.id;

      // -----------------------------
      // NEW FLOW: PAY ON ARRIVAL
      // -----------------------------
      if (paymentMethod === "PAY_ON_ARRIVAL") {
        const appointmentPayload = {
          email,
          patientId,
          city: selectedClinic.toUpperCase(),
          date: selectedDate,
          startTime: selectedTime,
          endTime: getEndTime(selectedTime),

          payment: {
            amount: fee ? fee * 100 : undefined, // keep consistent with backend (paise)
            currency,
            method: "PAY_ON_ARRIVAL",
            status: "PENDING",
          },
        };

        const created = (await api.post(
          "/appointments",
          appointmentPayload,
        )) as any;

        toast.success("Appointment confirmed! Pay at clinic.");
        router.push(`/appointment-confirmed/${created.appointment._id}`);
        return;
      }

      // -----------------------------
      // EXISTING FLOW: ONLINE PAYMENT
      // -----------------------------
      setOrderCreating(true);
      const orderResp = await api.post("/payments/create-order");
      setOrderCreating(false);

      const {
        order_id,
        key_id,
        amount,
        currency: orderCurrency,
      }: any = orderResp;

      if (!order_id || !key_id)
        throw new Error("Failed to create payment order");

      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Payment SDK failed to load");

      const checkoutOptions: any = {
        key: key_id,
        amount,
        currency: orderCurrency,
        name: clinicData[selectedClinic.toUpperCase()]?.name || "Clinic",
        description: "Consultation Fee",
        order_id,
        prefill: { name, email, contact: phone },
        notes: {
          clinic: selectedClinic.toUpperCase(),
          date: selectedDate,
          startTime: selectedTime,
        },
        handler: async (response: any) => {
          try {
            // verify
            await api.post("/payments/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            // create appointment
            const appointmentPayload = {
              email,
              patientId,
              city: selectedClinic.toUpperCase(),
              date: selectedDate,
              startTime: selectedTime,
              endTime: getEndTime(selectedTime),
              payment: {
                amount,
                currency: orderCurrency,
                method: "ONLINE",
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                status: "PAID",
              },
            };

            const created = (await api.post(
              "/appointments",
              appointmentPayload,
            )) as any;

            toast.success("Appointment confirmed!");
            router.push(`/appointment-confirmed/${created.appointment._id}`);
          } catch (err: any) {
            console.error("after-payment error", err);
            if (err?.response?.status === 409) {
              toast.error("Slot was taken. Choose another slot.");
            } else {
              toast.error(err?.message || "Booking failed after payment");
            }
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(checkoutOptions);
      rzp.open();
    } catch (err: any) {
      console.error("booking flow error", err);
      toast.error(err?.message || "Failed to book appointment");
      setLoading(false);
      setOrderCreating(false);
    }
  };

  const getEndTime = (start: string) => {
    const [hh, mm] = start.split(":").map(Number);
    const d = new Date();
    d.setHours(hh);
    d.setMinutes(mm + 30);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes(),
    ).padStart(2, "0")}`;
  };

  // UI helpers
  const availableClinicKeys = allowedClinics.map((k) => k.toLowerCase());
  const clinicsToRender = ["dehradun", "roorkee", "online"].filter((k) =>
    availableClinicKeys.includes(k),
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-primary hover:opacity-90"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back</span>
              </Link>

              <div className="pl-1">
                <h1 className="font-semibold text-lg sm:text-xl">
                  Book Consultation
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Choose a convenient time slot and confirm your booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT (Form) */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8 shadow-md border border-gray-200 rounded-2xl bg-white">
              <form onSubmit={handleBooking} className="space-y-8">
                {/* ---------------- DATE + TIME ---------------- */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Choose Date &
                    Time
                  </h2>

                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        const date = e.target.value;
                        setSelectedDate(date);
                        setSelectedTime("");

                        // Past date → block
                        if (isPastDate && isPastDate(date)) {
                          setBlockedInfo &&
                            setBlockedInfo({
                              blocked: true,
                              message: "Please select a future date",
                            });
                          return;
                        }

                        // Valid date → remove block
                        setBlockedInfo && setBlockedInfo({ blocked: false });
                      }}
                      className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      required
                    />

                    {slotsLoading && (
                      <p className="text-sm text-gray-500 mt-2">
                        Loading slots…
                      </p>
                    )}

                    {isPastDate && isPastDate(selectedDate) && (
                      <p className="text-red-600 text-sm mt-2">
                        Please select a future date
                      </p>
                    )}

                    {blockedInfo.blocked && (
                      <p className="text-red-600 text-sm mt-2">
                        {blockedInfo.message}
                      </p>
                    )}
                  </div>

                  {/* Time Slots (mobile-friendly horizontal scroll) */}
                  <div>
                    <label className="text-sm font-medium">
                      Available Slots
                    </label>
                    <div className="mt-2">
                      {/* If no date selected */}
                      {!selectedDate ? (
                        <p className="text-gray-500 text-sm">
                          Select a date first
                        </p>
                      ) : slots.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No slots available
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pb-1">
                          {slots.map((s) => (
                            <label
                              key={s.startTime}
                              className={`min-w-[110px] flex-shrink-0 p-2 sm:p-3 rounded-lg border text-center cursor-pointer transition select-none
                                ${
                                  selectedTime === s.startTime
                                    ? "border-primary bg-blue-100"
                                    : s.available
                                      ? "border-gray-300 bg-white hover:border-primary"
                                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="time"
                                value={s.startTime}
                                checked={selectedTime === s.startTime}
                                onChange={(e) =>
                                  setSelectedTime &&
                                  setSelectedTime(e.target.value)
                                }
                                className="hidden"
                                disabled={!s.available}
                              />
                              <div className="text-sm font-medium">
                                {formatTimeDisplay
                                  ? formatTimeDisplay(s.startTime)
                                  : s.startTime}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {s.available ? "Available" : "Booked"}
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6" />

                {/* ---------------- CLINIC ---------------- */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Choose Clinic
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {clinicsToRender.map((key) => {
                      const up = key.toUpperCase();
                      return (
                        <label
                          key={key}
                          className={`p-3 rounded-lg border cursor-pointer shadow-sm transition flex flex-col gap-1 h-full
                          ${
                            selectedClinic === key
                              ? "border-primary bg-blue-50 shadow-md"
                              : "border-gray-300 bg-white hover:border-primary"
                          }
                          `}
                          onClick={() =>
                            setSelectedClinic && setSelectedClinic(key)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">
                              {clinicData[up]?.name || up}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {clinicData[up]?.hours}
                          </p>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-6" />

                {/* ---------------- PATIENT INFO ---------------- */}
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Patient Details
                  </h2>
                  <p className="text-xs text-gray-500">
                    If you are booking for someone else, please enter the{" "}
                    <strong>patient's phone number</strong> here.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={name}
                      onChange={(e) => setName && setName(e.target.value)}
                      placeholder="Full Name"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                    {showErrors && !name && (
                      <p className="mt-2 text-sm text-red-600">
                        Enter patient's name
                      </p>
                    )}

                    <input
                      value={email}
                      onChange={(e) => setEmail && setEmail(e.target.value)}
                      placeholder="Email"
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      required
                    />
                  </div>
                  {showErrors && !email && (
                    <p className="mt-2 text-sm text-red-600">
                      Enter patient's email address
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        value={phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "");
                          if (v.length <= 10) setPhone && setPhone(v);
                        }}
                        placeholder="10-digit phone number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        required
                      />
                      {showErrors && (!phone || phone.length < 10) && (
                        <p className="mt-2 text-sm text-red-600">
                          Enter patient's valid 10-digit phone number
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="number"
                        value={age as any}
                        onChange={(e) =>
                          setAge &&
                          setAge(e.target.value ? Number(e.target.value) : "")
                        }
                        placeholder="Age"
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        required
                      />
                      {showErrors && (!age || Number(age) <= 0) && (
                        <p className="mt-2 text-sm text-red-600">
                          Enter patient's age
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Gender
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="M"
                          checked={gender === "M"}
                          onChange={() => setGender && setGender("M")}
                        />
                        <span className="text-sm">Male</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="F"
                          checked={gender === "F"}
                          onChange={() => setGender && setGender("F")}
                        />
                        <span className="text-sm">Female</span>
                      </label>
                    </div>
                    {showErrors && !gender && (
                      <p className="text-sm text-red-600 mt-2">
                        Select patient's gender
                      </p>
                    )}
                  </div>
                </div>

                {/* SUBMIT (large button on desktop, bottom sticky on mobile) */}
                <div className="border-t pt-6" />

                {/* ---------------- PAYMENT METHOD ---------------- */}
                <div className="space-y-4">
                  {/* <h2 className="text-xl sm:text-2xl font-bold">
                    Payment Method
                  </h2> */}

                  <div className="grid grid-cols-1 gap-3">
                    {/* <label
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        paymentMethod === "ONLINE"
                          ? "border-primary bg-blue-50"
                          : "border-gray-300 bg-white hover:border-primary"
                      }`}
                      onClick={() => setPaymentMethod("ONLINE")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Pay Online</p>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "ONLINE"}
                          onChange={() => setPaymentMethod("ONLINE")}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay now using UPI / Card / Netbanking
                      </p>
                    </label> */}

                    <label
                      className={`w-full p-4 rounded-lg border cursor-pointer transition ${
                        paymentMethod === "PAY_ON_ARRIVAL"
                          ? "border-primary bg-blue-50"
                          : "border-gray-300 bg-white hover:border-primary"
                      }`}
                      onClick={() => setPaymentMethod("PAY_ON_ARRIVAL")}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Pay on Arrival</p>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "PAY_ON_ARRIVAL"}
                          onChange={() => setPaymentMethod("PAY_ON_ARRIVAL")}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Pay at the clinic before consultation
                      </p>
                    </label>
                  </div>
                  <Button className="w-full bg-primary text-white hover:bg-primary/90 rounded-lg text-lg py-6 font-semibold">
                    Book Now
                  </Button>
                </div>

                <div className="lg:hidden" />
              </form>
            </Card>

            {/* MOBILE: compact info card under form */}
            <div className="mt-4 lg:hidden space-y-3">
              <Card className="p-4 shadow-sm rounded-2xl">
                <p className="font-semibold">Need Assistance?</p>
                <a href="tel:+919876543210" className="text-primary text-sm">
                  +91 98765 43210
                </a>
              </Card>
            </div>
          </div>

          {/* RIGHT SUMMARY (desktop) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="p-6 shadow-md rounded-2xl border border-primary/30 bg-blue-50">
                <h3 className="text-lg font-bold mb-4">Summary</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Clinic</p>
                    <p className="font-semibold">
                      {selectedClinic?.toUpperCase() || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Date & Time
                    </p>
                    <p className="font-semibold">
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                    <p className="text-sm">
                      {selectedTime
                        ? formatTimeDisplay
                          ? formatTimeDisplay(selectedTime)
                          : selectedTime
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase">
                      Consultation Fee
                    </p>

                    {pricingLoading ? (
                      <p className="text-gray-500">Loading…</p>
                    ) : fee ? (
                      <p className="font-bold text-xl text-primary">₹{fee}</p>
                    ) : (
                      <p className="text-red-500 font-semibold">Unavailable</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4 shadow-sm rounded-2xl">
                <p className="font-semibold text-sm">Need Assistance?</p>
                <a href="tel:+919876543210" className="text-primary text-sm">
                  +91 98765 43210
                </a>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* MOBILE: Sticky bottom summary / CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 p-3 sm:p-4 shadow-lg">
        <div className="mx-auto max-w-3xl px-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Consultation</p>
            <p className="font-semibold text-sm">{fee ? `₹${fee}` : "—"}</p>
            <p className="text-xs text-gray-500">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : "Pick a date"}
            </p>
          </div>

          <div className="w-1/2">
            <Button
              type="submit"
              form=""
              className="w-full py-5 text-sm font-semibold bg-primary text-white rounded-lg"
              disabled={
                !selectedDate ||
                !selectedTime ||
                blockedInfo.blocked ||
                loading ||
                orderCreating
              }
              onClick={(e) => {
                // Trigger the same submit used above. If your form has a ref, call ref.current.submit().
                // Otherwise the parent handleBooking can be exposed and called here.
                handleBooking && handleBooking(e);
              }}
            >
              {loading || orderCreating ? "Processing…" : "Book"}
            </Button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t py-6 text-center text-sm text-gray-600 mt-20">
        © 2026 Dr. Rachit Ahuja
      </footer>
    </main>
  );
}
