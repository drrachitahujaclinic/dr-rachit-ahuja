"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Video,
} from "lucide-react";

const CONTACT = {
  phone: "+91 98165 49972",
  email: "rachitahuja.dr@gmail.com",
};

const CLINICS = [
  {
    name: "Shri Mahant Indiresh Hospital",
    city: "Dehradun",
    address: "Patel Nagar, Dehradun, Uttarakhand",
    hours: "Monday – Saturday · 9:00 AM – 3:00 PM",
    map: "Shri Mahant Indiresh Hospital Dehradun",
  },
  {
    name: "Hemant Hospital",
    city: "Roorkee",
    address: "Roorkee, Uttarakhand",
    hours: "2nd & 4th Thursday · 10:30 AM – 2:30 PM",
    map: "Hemant Hospital Roorkee",
  },
];

export default function ContactPage() {
  const whatsapp = `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}`;

  return (
    <section className="bg-white">

      {/* HERO */}
      <div className="bg-blue-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Contact & Clinic Locations
          </h1>

          <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
            Schedule a consultation, ask questions, or get directions to our clinics.
          </p>

          {/* QUICK ACTIONS */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90"
            >
              <Phone className="w-4 h-4" />
              Call Clinic
            </a>

            <a
              href={whatsapp}
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50"
            >
              <ExternalLink className="w-4 h-4" />
              WhatsApp
            </a>

            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-2 px-6 py-3 rounded-lg border font-medium hover:bg-gray-50"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>

          </div>

        </div>
      </div>

      {/* CLINICS */}
      <div className="max-w-6xl mx-auto px-6 py-20">

        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
          Our Clinic Locations
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {CLINICS.map((clinic) => (

            <div
              key={clinic.city}
              className="border rounded-xl p-8 hover:shadow-lg transition"
            >

              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-gray-900">
                  {clinic.city}
                </h3>
              </div>

              <p className="font-medium text-gray-800">
                {clinic.name}
              </p>

              <p className="text-gray-600 mt-1">
                {clinic.address}
              </p>

              <div className="flex items-center gap-2 mt-4 text-gray-700">
                <Clock className="w-4 h-4 text-primary" />
                {clinic.hours}
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  clinic.map
                )}`}
                target="_blank"
                className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline"
              >
                Get Directions
                <ExternalLink className="w-4 h-4" />
              </a>

            </div>

          ))}

          {/* ONLINE */}
          <div className="border rounded-xl p-8">

            <div className="flex items-center gap-3 mb-4">
              <Video className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold text-gray-900">
                Online Consultation
              </h3>
            </div>

            <p className="text-gray-700">
              Secure video consultation via Google Meet.
            </p>

            <div className="flex items-center gap-2 mt-4 text-gray-700">
              <Clock className="w-4 h-4 text-primary" />
              Evening slots · 5:00 PM – 7:00 PM
            </div>

          </div>

        </div>

      </div>

      {/* CTA */}
      <div className="border-t bg-gray-50">

        <div className="max-w-6xl mx-auto px-6 py-16 text-center">

          <h3 className="text-2xl font-semibold text-gray-900">
            Ready to Book a Consultation?
          </h3>

          <p className="text-gray-600 mt-2">
            Choose your clinic and select an available appointment slot.
          </p>

          <Link href="/book-appointment">
            <button className="mt-6 px-8 py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90">
              Book Appointment
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}