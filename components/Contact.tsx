import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

/**
 * Contact.tsx — redesigned contact section (no form)
 * - Shows email, phone and clinics (per city)
 * - Mobile-first, white background, accessible links
 */

const CLINICS = [
  {
    key: "dehradun",
    name: "Shri Mahant Indiresh Hospital",
    city: "Dehradun",
    hours: "Mon–Sat · 10:00 AM – 2:00 PM",
    mapQuery: "Shri Mahant Indiresh Hospital Dehradun",
  },
  {
    key: "roorkee",
    name: "Hemant Hospital",
    city: "Roorkee",
    hours: "2nd & 4th Thursday · 10:00 AM – 2:00 PM",
    mapQuery: "Hemant Hospital Roorkee",
  },
  {
    key: "online",
    name: "Online Consultation (Google Meet)",
    city: "Online",
    hours: "Available during clinic hours",
    mapQuery: "Google Meet",
  },
];

export default function Contact() {
  const email = "info@excellenceoncology.com";
  const phone = "+919876543210";
  const whatsappLink = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <section id="contact" className="bg-linear-to-t from-blue-50 to-gray-50 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            Contact & Clinic Locations
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            Reach out to us by phone or email — or locate the clinic nearest you
            from the list below.
          </p>
        </div>

        {/* Primary contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-medium text-foreground hover:underline break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a
                    href={`tel:${phone}`}
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>

              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                <Phone className="w-4 h-4" />
                Call
              </a>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </Card>

          {/* Quick info card */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Office Hours</h3>
              <p className="text-sm text-gray-600">Monday – Saturday</p>
              <p className="text-sm font-medium text-foreground mb-3">10:00 AM – 2:00 PM</p>

              <p className="text-sm text-gray-600">Sunday</p>
              <p className="text-sm font-medium text-red-600">Closed</p>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span>Appointment duration</span>
                <span className="font-medium text-foreground">30 minutes</span>
              </div>
            </div>
          </Card>

          {/* Map / Directions quick link */}
          <Card className="p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Get Directions</h3>
              <p className="text-sm text-gray-600">
                Open each clinic on Google Maps for the exact address and directions.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2">
              {CLINICS.map((c) => (
                <a
                  key={c.key}
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    c.mapQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        {c.city} · <span className="font-medium text-foreground">{c.hours}</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </Card>
        </div>

        
        {/* Final CTA */}
        <div className="mt-10 text-center">
          <Link href="/book-appointment" className="inline-block">
            <Button size="lg" className="bg-primary text-white px-6 py-3">
              Book an Appointment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
