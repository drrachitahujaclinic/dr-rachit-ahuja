"use client";

import React, { useId, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Clock,
  Video,
  Calendar,
} from "lucide-react";

type FAQItem = { q: string; a: string };

const FAQS: FAQItem[] = [
  {
    q: "How do I book an appointment?",
    a: "You can book an appointment online by selecting your preferred clinic location (Dehradun, Roorkee, or Online), choosing an available date and time slot, entering patient details, and completing secure payment.",
  },
  {
    q: "Which clinic locations are available?",
    a: "Consultations are available at Shri Mahant Indiresh Hospital in Dehradun and Hemant Hospital in Roorkee. Online consultations are conducted through Google Meet.",
  },
  {
    q: "What are the consultation timings?",
    a: "Dehradun clinic operates Monday to Saturday from 9:00 AM – 3:00 PM. Roorkee clinic operates on the 2nd and 4th Thursday from 10:30 AM – 2:30 PM. Online consultations are typically scheduled between 5:00 PM – 7:00 PM.",
  },
  {
    q: "How long does a consultation last?",
    a: "Each consultation typically lasts around 30 minutes. This allows enough time to review medical history, discuss symptoms, examine reports, and provide treatment recommendations.",
  },
  {
    q: "Can I upload medical reports before the consultation?",
    a: "Yes. During booking you can upload reports, prescriptions, scans, or laboratory results. This helps the doctor review your case before the consultation.",
  },
  {
    q: "How will I receive confirmation of my appointment?",
    a: "Once your payment is completed, you will receive a confirmation email with your appointment details. Online consultations will also include your Google Meet link.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept UPI, debit cards, credit cards, and net banking payments. Online payment ensures your appointment slot is reserved and confirmed instantly.",
  },
  {
    q: "What should I bring for a clinic consultation?",
    a: "Please bring previous medical reports, imaging scans (CT/MRI/PET), pathology reports, prescriptions, and any medications you are currently taking.",
  },
  {
    q: "Who should book an online consultation?",
    a: "Online consultations are suitable for follow-ups, second opinions, and discussing reports. Some conditions may require an in-person visit for detailed evaluation.",
  },
];

function Collapsible({
  open,
  children,
  id,
}: {
  open: boolean;
  children: React.ReactNode;
  id: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      id={id}
      ref={ref}
      style={{
        maxHeight: open ? `${ref.current?.scrollHeight ?? 0}px` : "0px",
        transition: "max-height 0.3s ease",
        overflow: "hidden",
      }}
      aria-hidden={!open}
    >
      <div className="pt-2 pb-4 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export default function FAQ() {
  const uid = useId();
  const [expanded, setExpanded] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Find answers about appointments, consultation options,
            clinic timings, payments, and online consultations.
          </p>
        </header>

        {/* Quick Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">

          <div className="p-5 border rounded-xl bg-gray-50">
            <Clock className="w-5 h-5 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900">
              30 Minute Consultations
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Each appointment is scheduled for approximately 30 minutes.
            </p>
          </div>

          <div className="p-5 border rounded-xl bg-gray-50">
            <Video className="w-5 h-5 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900">
              Online Consultations
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Secure video consultations available through Google Meet.
            </p>
          </div>

          <div className="p-5 border rounded-xl bg-gray-50">
            <Calendar className="w-5 h-5 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900">
              Instant Confirmation
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Appointments are confirmed immediately after payment.
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-4 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq, i) => {
            const open = expanded === i;
            const label = `faq-${uid}-${i}`;
            const panel = `panel-${uid}-${i}`;

            return (
              <div
                key={label}
                className="border rounded-lg bg-white shadow-sm"
              >
                <button
                  id={label}
                  aria-expanded={open}
                  aria-controls={panel}
                  onClick={() =>
                    setExpanded((s) => (s === i ? null : i))
                  }
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {i + 1}
                    </span>

                    <span className="font-medium text-gray-900">
                      {faq.q}
                    </span>
                  </span>

                  {open ? (
                    <ChevronUp className="w-5 h-5 text-primary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary" />
                  )}
                </button>

                <Collapsible open={open} id={panel}>
                  <div className="px-5">{faq.a}</div>
                </Collapsible>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No questions found.
            </div>
          )}
        </div>

        
      </div>
    </section>
  );
}