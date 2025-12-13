import Link from "next/link";
import React from "react";

/**
 * Footer — minimal, rethought layout
 *
 * - Primary CTA ("Book Consultation") is placed first under site title
 * - Clear sections: Services, About, Contact
 * - Mobile-first, accessible, and minimal
 * - Replace links with real routes where appropriate
 */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand + CTA (first column) */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-3">Dr. Rachit Ahuja</h3>
            <p className="text-sm text-white/80 mb-4">
              Compassionate, expert cancer care.
            </p>

            {/* Primary action — prominent but minimal */}
            <div className="mt-2">
              <Link href="/book-appointment" className="inline-block">
                <button
                  type="button"
                  className="bg-white text-foreground font-medium px-4 py-2 rounded-md shadow-sm hover:opacity-95"
                >
                  Book Consultation
                </button>
              </Link>
            </div>
          </div>

          

          {/* About */}
          <div className="text-sm">
            <h4 className="font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-white/90">
              <li>
                <Link href="/#about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:underline">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact (minimal) */}
          <address className="not-italic text-sm">
            <h4 className="font-semibold mb-3">Contact</h4>

            <p className="text-white/90">
              Phone:{" "}
              <a href="tel:+919876543210" className="hover:underline">
                +91 98765 43210
              </a>
            </p>

            <p className="mt-2 text-white/90">
              Email:{" "}
              <a href="mailto:info@excellenceoncology.com" className="hover:underline">
                info@excellenceoncology.com
              </a>
            </p>

            <p className="mt-4 text-xs text-white/70">
              Shri Mahant Indiresh Hospital — Dehradun
            </p>
          </address>
        </div>

        {/* Divider + copyright */}
        <div className="mt-8 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/60">
            © {year} Dr. Rachit Ahuja Oncology. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
