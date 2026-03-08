import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Calendar,
  CreditCard,
  Video,
  CheckCircle,
  Clock,
} from "lucide-react";

import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";

/**
 * StepsNew.tsx
 * - Fresh build from scratch
 * - No absolute positioning (no overlaps)
 * - Mobile-first; grid on desktop
 * - White background
 * - Accessible (aria attributes)
 */
const STEPS = [
  {
    id: 1,
    title: "Select Clinic, Date & Time",
    description:
      "Choose your preferred consultation location — Dehradun, Roorkee, or Online. Then select a convenient date and a 30-minute available appointment slot from the calendar.",
    icon: <Calendar className="w-5 h-5" />,
    color: "blue",
  },
  {
    id: 2,
    title: "Enter Patient Details",
    description:
      "Provide the patient's basic information including name, phone number, age, and gender. You can also upload previous reports or prescriptions to help the doctor review your case in advance.",
    icon: <Clock className="w-5 h-5" />,
    color: "rose",
  },
  {
    id: 3,
    title: "Secure Payment & Confirmation",
    description:
      "Complete the secure online payment to confirm your appointment. Once successful, you will receive an email confirmation with your appointment details and instructions.",
    icon: <CreditCard className="w-5 h-5" />,
    color: "emerald",
  },
  {
    id: 4,
    title: "Attend Your Consultation",
    description:
      "Visit the clinic at your scheduled time or join the Google Meet link provided in your confirmation email for online consultations.",
    icon: <Video className="w-5 h-5" />,
    color: "blue",
  },
];


/** Circle badge for step number (used in both mobile and desktop) */
function StepBadge({ n, color }: { n: number; color: string }) {
  const bg = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  }[color];

  
  return (
    <div
      className={`flex items-center justify-center w-12 h-12 rounded-full border ${bg} font-semibold`}
      aria-hidden
    >
      {n}
    </div>
  );
}

export default function StepsNew() {
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
    <section id="journey" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground">
            How to Book Your Appointment
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-gray-600">
            Simple and clear — select a slot, provide patient details, pay securely,
            and attend online or in-clinic.
          </p>
        </header>

        {/* Steps layout:
            - mobile: stacked timeline (badge on left)
            - md+: horizontal row of cards with connectors
         */}
        <div className="space-y-8 md:space-y-0">
          {/* Desktop: row with connectors */}
          <div className="hidden md:flex items-stretch gap-5">
            {STEPS.map((s, idx) => (
              <div key={s.id} className="flex-1 flex">
                <Card className="w-full p-6 md:p-8 flex flex-col justify-between border border-gray-100 shadow-sm">
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex-shrink-0">
                      <StepBadge n={s.id} color={s.color} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  
                </Card>

                
              </div>
            ))}
          </div>

          {/* Mobile stacked timeline */}
          <ol className="md:hidden flex flex-col gap-6">
            {STEPS.map((s) => (
              <li key={s.id} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <StepBadge n={s.id} color={s.color} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-foreground">{s.title}</h4>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">{s.description}</p>

                  
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-12 text-center">
          <Button onClick={handleBook} size="lg">
            Book Your Slot Now
          </Button>

          <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
            Need help? Call us at{" "}
            <a href="tel:+919816549972" className="text-primary font-medium">
              +91 98165 49972
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
