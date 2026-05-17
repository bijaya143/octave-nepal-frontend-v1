"use client";
import Container from "@/components/Container";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constant";
import React from "react";
import Link from "next/link";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
  category?: string;
};

const faqs: FaqItem[] = [
  {
    question: "What is " + SITE_NAME + "?",
    answer: (
      <p>
        {SITE_NAME} is an AI-powered online learning platform in Nepal. We offer
        practical, project-based and cohort-based courses taught by industry
        practitioners, combined with live Q&A sessions, collaborative student
        channels, and a focus on real-world career outcomes.
      </p>
    ),
    category: "General",
  },
  {
    question: "Are courses self-paced or live?",
    answer: (
      <p>
        We use a hybrid learning model: you learn at your own pace with
        high-quality pre-recorded modules during the week, combined with regular
        live interactive Q&A sessions, cohort assignments, and structured weekly
        milestones led by expert instructors.
      </p>
    ),
    category: "Format",
  },
  {
    question: "How do I enroll in a course?",
    answer: (
      <p>
        Browse our Courses page, select a course, and click Enroll. We support
        seamless local payment options including eSewa, Khalti, Fonepay (via QR
        scan), ConnectIPS, as well as local and international credit/debit
        cards. Enrollment is instant upon successful payment.
      </p>
    ),
    category: "Enrollment",
  },
  {
    question: "Do you provide certificates?",
    answer: (
      <p>
        Yes. Upon completing all required course modules, assignments, and the
        capstone project, you will receive a verified digital certificate from{" "}
        {SITE_NAME} that you can share on LinkedIn or include in your resume for
        potential employers.
      </p>
    ),
    category: "Certification",
  },
  {
    question: "What if I get stuck on a concept or assignment?",
    answer: (
      <p>
        You are never left alone! Every course has a dedicated community space
        (on Slack or Discord) where you can collaborate with peers, ask
        questions, get feedback on your projects, and attend live weekly office
        hours hosted by our course instructors and teaching assistants.
      </p>
    ),
    category: "Support",
  },
  {
    question: "Do courses include real-world projects?",
    answer: (
      <p>
        Absolutely. Our curriculum is entirely project-based. You will build
        multiple hands-on projects throughout the course, culminating in a
        capstone project that solves actual business problems, helping you build
        a professional portfolio that stands out to hiring managers.
      </p>
    ),
    category: "Curriculum",
  },
  {
    question: "Can I join as a complete beginner?",
    answer: (
      <p>
        Yes! We offer a wide range of foundational courses made specifically for
        beginners across various fields, including business, creative arts,
        technology, and professional skills. Prerequisites (if any) are clearly
        listed on each individual course page so you know exactly where to
        start.
      </p>
    ),
    category: "Learning",
  },
  {
    question: "Do you offer student discounts?",
    answer: (
      <p>
        We occasionally run promotional discounts and offers. Subscribe to the
        newsletter on our homepage or follow us on our social media handles to
        stay updated on upcoming scholarships and special cohort offers.
      </p>
    ),
    category: "Pricing",
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        We offer a 7-day refund window if the course is not a good fit for you
        and you have consumed less than 20% of the content. You can submit a
        refund request through the Contact page with your purchase details.
      </p>
    ),
    category: "Payments",
  },
  {
    question: "Can I access courses on mobile?",
    answer: (
      <p>
        Yes. The platform is fully responsive and optimized for modern mobile
        browsers, allowing you to learn on the go from your phone or tablet.
      </p>
    ),
    category: "Access",
  },
];

export default function FaqContent() {
  const [query, setQuery] = React.useState("");
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        (typeof f.answer === "string"
          ? (f.answer as string).toLowerCase().includes(q)
          : false),
    );
  }, [query]);

  return (
    <main>
      <section className="py-5 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <Container>
          <div className="relative">
            <div className="mb-3">
              <Badge variant="outline">Help & Support</Badge>
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
                            {item.answer}
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
                      Can’t find your answer here? Reach out to our team and
                      we’ll get back soon.
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
                          new Set(faqs.map((f) => f.category).filter(Boolean)),
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
