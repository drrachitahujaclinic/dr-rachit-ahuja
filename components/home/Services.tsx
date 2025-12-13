// components/Services.tsx
import React from "react";
import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Target,
  Microscope,
  HeartHandshake,
  FileText,
  Coffee,
  CheckSquare,
} from "lucide-react";

/**
 * Services - redesigned modern layout
 * - Removed per-card "Learn More"
 * - Single CTA below the grid
 * - Responsive: 1 / 2 / 3 columns
 */

const services = [
  {
    id: "chemo",
    title: "Chemotherapy Planning",
    desc:
      "Personalised regimens designed from tumor biology and overall health — balancing efficacy and tolerability.",
    Icon: Target,
  },
  {
    id: "diagnosis",
    title: "Consultation & Diagnosis",
    desc:
      "Thorough diagnostic evaluation including imaging, biopsies and pathology review for accurate staging.",
    Icon: Microscope,
  },
  {
    id: "palliative",
    title: "Pain Management & Palliative Care",
    desc:
      "Multidisciplinary support and advanced pain control strategies to improve quality of life during treatment.",
    Icon: HeartHandshake,
  },
  {
    id: "followup",
    title: "Follow-up Programs",
    desc:
      "Long-term monitoring and proactive management of late effects, surveillance imaging and survivorship care.",
    Icon: FileText,
  },
  {
    id: "nutrition",
    title: "Nutritional & Lifestyle Support",
    desc:
      "Diet and lifestyle planning to support treatment tolerance, immunity and recovery.",
    Icon: Coffee,
  },
  {
    id: "second-opinion",
    title: "Second-Opinion Consultations",
    desc:
      "Independent expert review to validate or refine your treatment plan and discuss alternatives.",
    Icon: CheckSquare,
  },
];

const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="py-20 lg:py-28 bg-gradient-to-b from-white to-blue-50"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center mb-12">
          <h2
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight"
          >
            Comprehensive Oncology Care
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
            Advanced, evidence-based treatments tailored to each patient — from diagnostics and chemotherapy to
            supportive care and long-term follow-up.
          </p>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map(({ id, title, desc, Icon }) => (
            <Card
              key={id}
              className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-white border border-gray-100
                hover:shadow-xl transition-shadow duration-300"
            >
              {/* accent stripe (subtle) */}
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-gray-200 rounded-l-2xl opacity-90"
              />

              <div className="ml-4 relative">
                <div className="flex items-center gap-4">
                  <div className="flex-none w-14 h-14 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">{desc}</p>
                  </div>
                </div>

                {/* subtle metadata / tags row */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
                    Expert Care
                  </span>
                  <span className="text-xs inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 text-gray-600">
                    Evidence based
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link href="/book-appointment" className="w-full max-w-fit">
            <Button
              size="lg"
              className="px-8 py-4 text-white font-semibold shadow-lg"
            >
              Book Consultation
            </Button>
          </Link>
        </div>

        {/* small helper text */}
        <p className="mt-6 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          If you’re booking for someone else, please enter the patient’s contact details on the booking form.
        </p>
      </div>
    </section>
  );
};

export default Services;
