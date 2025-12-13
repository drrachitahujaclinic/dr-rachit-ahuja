"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth";
import toast from "react-hot-toast";
import { Calendar, Clock, MapPin, Video, ArrowRight } from "lucide-react";

/**
 * AppointmentsPage (redesigned)
 *
 * - Clean, minimal, non-overlapping layout
 * - Hero with Book Consultation as first action below title
 * - Compact contact/clinic info block
 * - Responsive appointments list with clear columns (date/time, details, status/action)
 * - Loading skeleton + friendly empty state
 *
 * Keeps your original variable names (appointments, formatDate, formatTime, clinicData, etc.)
 */

export default function AppointmentsPage() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = (await api.get("/appointments")) as any;
      setAppointments(res.appointments || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load appointments");
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clinicData: any = {
    DEHRADUN: { name: "Shri Mahant Indiresh Hospital" },
    ROORKEE: { name: "Hemant Hospital" },
    ONLINE: { name: "Online – Google Meet" },
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const hh = h % 12 || 12;
    const suffix = h >= 12 ? "PM" : "AM";
    return `${hh}:${m.toString().padStart(2, "0")} ${suffix}`;
  };

  // derive upcoming / past using date + startTime
  const now = useMemo(() => new Date(), []);
  const categorize = (a: any) => {
    try {
      const date = new Date(a.date);
      const [hh, mm] = (a.startTime || "00:00").split(":").map(Number);
      date.setHours(hh, mm, 0, 0);
      return date >= now ? "upcoming" : "past";
    } catch {
      return "past";
    }
  };

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((a) => categorize(a) === filter);
  }, [appointments, filter]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* HEADER / HERO */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your upcoming consultations and view past visits.
            </p>
          </div>

          {/* Primary CTA appears in hero (first section below title) */}
          <div className="flex items-center gap-3">
            <Link href="/book-appointment" className="inline-block">
              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:opacity-95">
                Book Consultation
              </button>
            </Link>

            <button
              onClick={() => fetchAppointments()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* TOP CONTACT / CLINIC INFO (minimal) */}
      <section aria-labelledby="contact-heading" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 id="contact-heading" className="text-sm font-semibold text-gray-700">Contact</h2>
            <p className="mt-2 text-sm text-gray-600">Phone: <a href="tel:+919876543210" className="text-primary">+91 98765 43210</a></p>
            <p className="mt-1 text-sm text-gray-600">Email: <a href="mailto:info@excellenceoncology.com" className="text-primary">info@excellenceoncology.com</a></p>
          </div>

          
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-white p-1 shadow-sm border border-gray-100">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "all" ? "bg-primary text-white" : "text-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "upcoming" ? "bg-primary text-white" : "text-gray-700"}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${filter === "past" ? "bg-primary text-white" : "text-gray-700"}`}
            >
              Past
            </button>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {appointments.length} total
          </div>
        </div>
      </section>

      {/* MAIN CONTENT (appointments list) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-12">
        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-4 mt-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-6 bg-white rounded-2xl p-6 border border-red-100 text-red-700">
            {error}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="mt-6 bg-white rounded-2xl p-8 border border-dashed border-gray-200 text-center">
            <p className="text-lg font-medium text-gray-700">No appointments found</p>
            <p className="text-sm text-gray-500 mt-2">Try a different filter or book a new consultation.</p>
            <div className="mt-4">
              <Link href="/book-appointment">
                <button className="bg-primary text-white px-4 py-2 rounded-md">Book Consultation</button>
              </Link>
            </div>
          </div>
        ) : (
          <ul role="list" className="mt-6 space-y-4">
            {filteredAppointments.map((a: any) => {
              const isOnline = a.city === "ONLINE";
              const clinic = clinicData[a.city] || { name: a.city || "Clinic" };

              // status classes
              const statusClasses =
                a.status === "confirmed"
                  ? "bg-green-50 text-green-800"
                  : a.status === "cancelled"
                  ? "bg-red-50 text-red-800"
                  : "bg-yellow-50 text-yellow-800";

              return (
                <li key={a._id}>
                  <Link href={`/appointment-confirmed/${a._id}`} className="block">
                    <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                        {/* Date/time block */}
                        <div className="sm:col-span-3 flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center">
                            <div className="text-xs text-gray-500">{new Date(a.date).toLocaleDateString("en-IN", { weekday: "short" })}</div>
                            <div className="text-sm font-semibold text-gray-800">{new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
                          </div>

                          <div className="hidden sm:block">
                            <div className="text-xs text-gray-500">Time</div>
                            <div className="text-sm font-medium text-gray-700">{formatTime(a.startTime)} – {formatTime(a.endTime)}</div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="sm:col-span-7 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">{clinic.name}</h3>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <div className="inline-flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{formatDate(a.date)}</span>
                            </div>

                            <div className="inline-flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{formatTime(a.startTime)} – {formatTime(a.endTime)}</span>
                            </div>

                            <div className="inline-flex items-center gap-2">
                              {isOnline ? <Video className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-red-500" />}
                              <span className="font-medium text-gray-700">{clinic.name}</span>
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-gray-500">Patient: <span className="font-medium text-gray-700">{a.patientId?.name}</span></p>
                        </div>

                        {/* Status & action */}
                        <div className="sm:col-span-2 flex flex-col items-start sm:items-end gap-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                            {String(a.status).toUpperCase()}
                          </span>

                          <div className="mt-2">
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-sm py-8">
        © {new Date().getFullYear()} Dr. Rachit Ahuja
      </footer>
    </main>
  );
}
