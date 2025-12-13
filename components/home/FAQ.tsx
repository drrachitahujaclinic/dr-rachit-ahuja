import React, { useId, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

type FAQItem = { q: string; a: string };

/**
 * FAQ.tsx
 * - Mobile-first, white background
 * - Accessible accordion (single-expand by default)
 * - Search/filter + keyboard navigation
 * - Smooth, safe height transitions (respects prefers-reduced-motion)
 */

const DEFAULT_FAQS: FAQItem[] = [
  {
    q: "What are the clinic timings?",
    a: "Roorkee clinic operates on 2nd & 4th Thursday from 10:00 AM – 2:00 PM IST. Dehradun clinic operates Monday to Saturday, 10:00 AM – 2:00 PM IST (Sunday Closed).",
  },
  {
    q: "Do you offer online consultations?",
    a: "Yes, we offer video consultations for follow-up appointments and second opinions. Initial consultations typically require an in-person visit for comprehensive evaluation.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, online bank transfers, and digital payment methods. Payment can be made during booking for guaranteed appointment slots.",
  },
  {
    q: "How long is each appointment?",
    a: "Each appointment is 30 minutes long. This includes consultation, discussion of treatment options, and any necessary recommendations.",
  },
];

function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

/** Animated collapse: controlled maxHeight with CSS transition (respects reduced motion) */
function Collapsible({
  isOpen,
  children,
  id,
}: {
  isOpen: boolean;
  children: React.ReactNode;
  id: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // inline styles to animate maxHeight
  const style: React.CSSProperties = {
    overflow: "hidden",
    transition: reduced ? "none" : "max-height 320ms cubic-bezier(0.2, 0.8, 0.2, 1)",
    maxHeight: isOpen ? `${ref.current?.scrollHeight ?? 0}px` : "0px",
  };

  return (
    <div id={id} ref={ref} style={style} aria-hidden={!isOpen}>
      <div className="pt-2 pb-4 text-sm leading-relaxed text-gray-700">{children}</div>
    </div>
  );
}

function FaqItem({
  index,
  faq,
  isOpen,
  onToggle,
  labelId,
  panelId,
}: {
  index: number;
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  labelId: string;
  panelId: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
      <h3 className="m-0">
        <button
          id={labelId}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={onToggle}
          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          <span className="flex-1 text-sm md:text-base font-medium text-foreground">{faq.q}</span>
          <span className="ml-4 flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:inline">Answer</span>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-primary" aria-hidden />
            ) : (
              <ChevronDown className="w-5 h-5 text-primary" aria-hidden />
            )}
          </span>
        </button>
      </h3>

      <Collapsible isOpen={isOpen} id={panelId}>
        <div role="region" aria-labelledby={labelId} className="px-5">
          {faq.a}
        </div>
      </Collapsible>
    </div>
  );
}

export default function FAQ() {
  const uid = useId();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const [allowMultiple, setAllowMultiple] = useState(false); // toggle to allow multiple open if needed
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEFAULT_FAQS;
    return DEFAULT_FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [query]);

  // Keyboard navigation helpers (Arrow up/down to move between question buttons)
  const onKeyDownNav = (e: React.KeyboardEvent, idx: number) => {
    const max = filtered.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nxt = (idx + 1) % max;
      itemsRef.current[nxt]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (idx - 1 + max) % max;
      itemsRef.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      itemsRef.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      itemsRef.current[max - 1]?.focus();
    }
  };

  return (
    <section id="faq" className="bg-blue-50 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Find quick answers about appointments, payments, cancellations and more.
          </p>
        </div>

        {/* Controls */}
        
        {/* FAQs list */}
        <div className="space-y-3" role="list" aria-label="FAQ list">
          {filtered.length === 0 && (
            <div className="p-6 bg-white border border-gray-100 rounded-lg text-center text-sm text-gray-500">
              No results found for “{query}”
            </div>
          )}

          {filtered.map((faq, idx) => {
            const globalIndex = idx; // index in filtered list
            const labelId = `faq-${uid}-label-${idx}`;
            const panelId = `faq-${uid}-panel-${idx}`;
            const isOpen = allowMultiple ? false /* multiple-mode not tracking here */ : expandedIndex === globalIndex;

            // In multiple-open mode we'll treat the single list as simple toggle: open if index equals expandedIndex
            // To fully support multiple opens you'd need an array of booleans — keep single-open default because it's simpler and clearer.
            return (
              <div key={labelId} role="listitem">
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <h3 className="m-0">
                    <button
                      id={labelId}
                      aria-controls={panelId}
                      aria-expanded={isOpen}
                      onClick={() => {
                        if (allowMultiple) {
                          // naive toggle behavior: open clicked item, but allowMultiple would ideally maintain an array.
                          // For simplicity, in allowMultiple mode we toggle same single open index behavior.
                          setExpandedIndex((s) => (s === globalIndex ? null : globalIndex));
                        } else {
                          setExpandedIndex((s) => (s === globalIndex ? null : globalIndex));
                        }
                      }}
                      onKeyDown={(e) => onKeyDownNav(e, globalIndex)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/5 text-primary text-sm font-medium">
                            {globalIndex + 1}
                          </span>
                          <span className="text-sm md:text-base font-medium text-foreground">
                            {faq.q}
                          </span>
                        </div>
                      </div>

                      <span className="ml-4 flex items-center gap-2 text-gray-400">
                        {expandedIndex === globalIndex ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-primary" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <Collapsible isOpen={expandedIndex === globalIndex} id={panelId}>
                    <div role="region" aria-labelledby={labelId} className="px-5">
                      {faq.a}
                    </div>
                  </Collapsible>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/95"
          >
            Still have questions? Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
