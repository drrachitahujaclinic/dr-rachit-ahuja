import React from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Clock, MapPin } from "lucide-react";

/**
 * ClinicDetails - redesigned, single-color-blue theme for both cards
 * - removed phone/email/buttons inside cards
 * - unified gradient header color for both cards
 * - improved spacing, typography, and responsive layout
 * - single central CTA below both cards
 */
const ClinicDetails: React.FC = () => {
  // shared blue gradient used for both cards (keeps same color)
  const headerGradient = "bg-gradient-to-r from-blue-600 to-blue-500";

  return (
    <section
      id="clinics"
      aria-labelledby="clinics-heading"
      className="py-20 lg:py-28 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 id="clinics-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
            Visit Our Clinics
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Two convenient locations offering expert, compassionate oncology care — choose a clinic or book an online consultation.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
  {/* Roorkee */}
  <Card className="group bg-primary overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border">
    {/* Header: solid primary background (no gradient) */}
    <div className="bg-primary p-6 flex items-end rounded-t-2xl">
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-semibold text-white">Roorkee Clinic</h3>
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90">
            2nd &amp; 4th Thursday
          </span>
        </div>
      </div>

      {/* subtle svg / badge */}
      <div className="ml-4 opacity-90 hidden sm:block" aria-hidden>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="rgba(255,255,255,0.08)"></rect>
          <path d="M7 12h10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 16h10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>

    <div className="p-6 sm:p-8 bg-white">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Hemant Hospital, Roorkee</p>
          <p className="mt-1 text-sm text-gray-600">Uttarakhand 247667</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Hours</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">10:00 AM – 2:00 PM</p>
          <p className="mt-1 text-sm text-gray-600">Roorkee &amp; Online on 2nd &amp; 4th Thursday</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Specialist outpatient clinic held fortnightly. Please check availability on the booking page.
        </p>
      </div>
    </div>
  </Card>

  {/* Dehradun */}
  <Card className="group bg-primary overflow-hidden border rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
    <div className="bg-primary p-6 flex items-end rounded-t-2xl">
      <div className="flex-1">
        <h3 className="text-xl sm:text-2xl font-semibold text-white">Dehradun Clinic</h3>
        <div className="mt-2 inline-flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90">
            Monday – Saturday
          </span>
        </div>
      </div>

      <div className="ml-4 opacity-90 hidden sm:block" aria-hidden>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="2" width="20" height="20" rx="6" fill="rgba(255,255,255,0.08)"></rect>
          <path d="M7 8h10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M7 12h10" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>

    <div className="p-6 sm:p-8 bg-white">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">Shri Mahant Indiresh Hospital</p>
          <p className="mt-1 text-sm text-gray-600">Dehradun, Uttarakhand 248001</p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
          <Clock className="w-6 h-6 text-primary" />
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Consultation Hours</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">10:00 AM – 2:00 PM</p>
          <p className="mt-1 text-sm text-gray-600">Closed on Sunday</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Regular weekday clinics with extended slots. Use the booking flow to select date and slot.
        </p>
      </div>
    </div>
  </Card>
</div>

        {/* Single shared CTA */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link href="/book-appointment" className="w-full max-w-fit">
            <Button
              size="lg"
              className="px-8 py-4 font-semibold shadow-lg"
            >
              Book Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClinicDetails;
