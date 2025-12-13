"use client";

import { Button } from "../ui/button";
import Link from "next/link";
import { Phone, CalendarDays } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100 flex sm:items-center items-start">

      {/* Floating Background Accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-52 h-52 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-8 sm:py-20">

        {/* RIGHT — BIG IMAGE */}
        <div className="sm:hidden">
          <div className="relative">
            {/* Glow */} 
            <div className="absolute inset-0 bg-blue-200/30 rounded-xl" />

            <img
              src={`${process.env.NEXT_PUBLIC_AWS_URL}/uploads/doctor-holding-stethoscope-arm.jpg`}
              alt="Doctor"
              className="relative w-[600px] max-w-full rounded-xl object-cover"
            />
          </div>
        </div>

        {/* LEFT — TEXT CONTENT */}
        <div className="text-center lg:text-left space-y-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
            Compassionate Cancer Care by
            <br />
            <span className="text-primary">Dr. Rachit Ahuja</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 max-w-xl leading-relaxed mx-auto lg:mx-0">
            Senior Medical Oncologist offering evidence-based treatment tailored
            to your needs. Book a consultation and take the next step toward
            healing.
          </p>

         

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <Button
              size="lg"
              className="bg-primary rounded-full hover:bg-primary/90 text-white shadow-md px-10 py-6 text-lg flex items-center gap-2"
              asChild
            >
              <Link href="/book">
                <CalendarDays className="w-5 h-5" /> Book Consultation
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-primary rounded-full text-primary hover:bg-blue-50 px-10 py-6 text-lg flex items-center gap-2"
              asChild
            >
              <a href="tel:+919876543210">
                <Phone className="w-5 h-5" /> Call Clinic
              </a>
            </Button>
          </div>
        </div>

        {/* RIGHT — BIG IMAGE */}
        <div className="hidden lg:flex justify-end">
          <div className="relative">
            {/* Glow */} 
            <div className="absolute inset-0 bg-blue-200/30 rounded-xl scale-110" />

            <img
              src={`${process.env.NEXT_PUBLIC_AWS_URL}/uploads/doctor-holding-stethoscope-arm.jpg`}
              alt="Doctor"
              className="relative w-[600px] max-w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
