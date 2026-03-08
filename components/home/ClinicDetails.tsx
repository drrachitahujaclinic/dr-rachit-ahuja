"use client";

import React from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Clock, MapPin, Video, Hospital, Navigation } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";

const clinicData = {
  DEHRADUN: {
    name: "Shri Mahant Indiresh Hospital",
    location: "Dehradun, Uttarakhand",
    hours: "9:00 AM – 3:00 PM",
    schedule: "Monday – Saturday",
    maps: "https://maps.google.com/?q=Shri+Mahant+Indiresh+Hospital+Dehradun",
  },

  ROORKEE: {
    name: "Hemant Hospital",
    location: "Roorkee, Uttarakhand",
    hours: "10:30 AM – 2:30 PM",
    schedule: "2nd & 4th Thursday",
    maps: "https://maps.google.com/?q=Hemant+Hospital+Roorkee",
  },

  ONLINE: {
    name: "Online Consultation",
    location: "Google Meet",
    hours: "5:00 PM – 7:00 PM",
    schedule: "Selected Evenings",
  },
};

const ClinicDetails: React.FC = () => {
  const {loginWithGoogle, setRedirect, user} = useAuthStore();
  const router = useRouter();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginWithGoogle(tokenResponse.access_token);

      // After login, continue to the stored redirect page if exists
      const path = useAuthStore.getState().redirectTo;
      if (path) {
        setRedirect(null);
        router.push(path);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });
  
  // Book consultation logic
  const handleBook = async () => {
    if (!user) {
      setRedirect("/book-appointment");     // store where user wanted to go
      handleGoogleLogin();      // trigger login popup
      return;
    }

    router.push("/book-appointment");
  };

  
  return (
    <section
      id="clinics"
      className="py-24 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Book a Consultation
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Visit our clinics in Dehradun or Roorkee, or consult online through
            secure video consultation.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* DEHRADUN */}
          <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-xl transition">

            <div className="p-8 space-y-6">

              <div className="flex items-center gap-3">
                <Hospital className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold uppercase text-primary">
                  Physical Clinic
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {clinicData.DEHRADUN.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {clinicData.DEHRADUN.schedule}
                </p>
              </div>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.DEHRADUN.location}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.DEHRADUN.hours}
                  </span>
                </div>

                {/* GOOGLE MAPS */}
                <a
                  href={clinicData.DEHRADUN.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>

              </div>

                <Button onClick={handleBook} className="w-full">
                  Book Dehradun Consultation
                </Button>

            </div>
          </Card>


          {/* ROORKEE */}
          <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-xl transition">

            <div className="p-8 space-y-6">

              <div className="flex items-center gap-3">
                <Hospital className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold uppercase text-primary">
                  Visiting Clinic
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {clinicData.ROORKEE.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {clinicData.ROORKEE.schedule}
                </p>
              </div>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.ROORKEE.location}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.ROORKEE.hours}
                  </span>
                </div>

                {/* GOOGLE MAPS */}
                <a
                  href={clinicData.ROORKEE.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>

              </div>

              <Button onClick={handleBook} className="w-full">
                  Book Roorkee Consultation
                </Button>

            </div>
          </Card>


          {/* ONLINE */}
          <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-xl transition">

            <div className="p-8 space-y-6">

              <div className="flex items-center gap-3">
                <Video className="w-6 h-6 text-primary" />
                <span className="text-xs font-semibold uppercase text-primary">
                  Video Consultation
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {clinicData.ONLINE.name}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {clinicData.ONLINE.schedule}
                </p>
              </div>

              <div className="space-y-4">

                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.ONLINE.location}
                  </span>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-gray-700 text-sm">
                    {clinicData.ONLINE.hours}
                  </span>
                </div>

              </div>

              <Button onClick={handleBook} className="w-full">
                  Book Online Consultation
                </Button>

            </div>
          </Card>

        </div>
      </div>
    </section>
  );
};

export default ClinicDetails;