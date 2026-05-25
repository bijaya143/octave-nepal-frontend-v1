"use client";
import Container from "@/components/Container";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constant";
import { faqs, type FaqItem } from "@/lib/faq-data";
import React from "react";
import Link from "next/link";

export default function FaqContent() {
  const [query, setQuery] = React.useState("");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f: FaqItem) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main>
      <section className="py-5 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <Container>
          <div className="relative">
            <div className="mb-3">
              <Badge variant="outline">Help &amp; Support</Badge>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Frequently asked questions
            </h1>
            <p className="mt-2 text-[color:var(--color-neutral-600)] text-sm md:text-base max-w-2xl">
              Answers to common questions about enrollment, certificates,
              pricing, and how {SITE_NAME} works.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr,380px] gap-5 md:gap-8 items-start">
              <div>
                <Card className="p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
                  <CardContent className="py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="text"
                        placeholder="Search FAQs"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-11 flex-1 min-w-0 rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-4 shadow-xs focus:border-[color:var(--color-primary-400)]"
                        aria-label="Search FAQs"
                      />
                      <Button variant="secondary" onClick={() => setQuery("")}>
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-5 space-y-3">
                  {filtered.length === 0 && (
                    <Card>
                      <CardContent className="py-6">
                        <p className="text-sm text-[color:var(--color-neutral-600)]">
                          No results. Try different keywords.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {filtered.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                      <div
                        key={item.question}
                        className="rounded-xl border border-[color:var(--color-neutral-200)] bg-white"
                      >
                        <button
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          aria-expanded={isOpen}
                        >
                          <span
                            className="font-semibold break-words"
                            style={{ fontFamily: "var(--font-heading-sans)" }}
                          >
                            {item.question}
                          </span>
                          <span
                            className="text-[color:var(--color-neutral-500)]"
                            aria-hidden
                          >
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-[color:var(--color-neutral-700)] break-words">
                            <p>{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside>
                <Card className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]" />
                  <CardContent className="relative py-6">
                    <h2
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      Still need help?
                    </h2>
                    <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                      Can't find your answer here? Reach out to our team and
                      we'll get back soon.
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Link href="/contact-us" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto">
                          Contact support
                        </Button>
                      </Link>
                      <Link href="/courses" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full sm:w-auto"
                        >
                          Browse courses
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-5 space-y-3">
                  <Card>
                    <CardContent className="py-5">
                      <h3
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        Popular topics
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Array.from(
                          new Set(
                            faqs.map((f: FaqItem) => f.category).filter(Boolean),
                          ),
                        ).map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-full border border-[color:var(--color-neutral-200)] px-3 py-1 text-xs bg-white"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
