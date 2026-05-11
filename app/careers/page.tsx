import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { CheckCircle2, Lightbulb } from "lucide-react";
import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constant";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Careers - " + SITE_NAME,
  description:
    "Join our team and help us build a better future for " + SITE_NAME + ".",
};

export default function CareersPage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-5 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <Container>
          <div className="relative grid lg:grid-cols-2 items-center gap-8 lg:gap-12">
            <div>
              <div className="mb-3">
                <Badge variant="outline">We are hiring</Badge>
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Build education with us
              </h1>
              <p className="text-[color:var(--color-neutral-600)] text-sm sm:text-base md:text-lg lg:text-xl mb-6">
                Join a mission-driven team creating impactful learning
                experiences for thousands of learners in Nepal.
              </p>
            </div>
            <div>
              <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_65%)]" />
                <CardContent className="relative py-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                    <li className="group flex items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/60 px-3 py-3 md:px-4 md:py-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-lg bg-blue-600/10 text-blue-600 ring-1 ring-black/5 flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 md:h-5 md:w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[color:var(--foreground)] font-medium text-sm md:text-base">
                        Remote-friendly
                      </span>
                    </li>
                    <li className="group flex items-center gap-3 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/60 px-3 py-3 md:px-4 md:py-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-lg bg-emerald-600/10 text-emerald-600 ring-1 ring-black/5 flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 md:h-5 md:w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[color:var(--foreground)] font-medium text-sm md:text-base">
                        Learning stipend
                      </span>
                    </li>
                    <li className="group flex items-center gap-3 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100/60 px-3 py-3 md:px-4 md:py-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-lg bg-violet-600/10 text-violet-600 ring-1 ring-black/5 flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 md:h-5 md:w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[color:var(--foreground)] font-medium text-sm md:text-base">
                        Meaningful ownership
                      </span>
                    </li>
                    <li className="group flex items-center gap-3 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/60 px-3 py-3 md:px-4 md:py-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="shrink-0 h-9 w-9 md:h-10 md:w-10 rounded-lg bg-amber-500/10 text-amber-600 ring-1 ring-black/5 flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 md:h-5 md:w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-[color:var(--foreground)] font-medium text-sm md:text-base">
                        Impact at scale
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="mt-12 md:mt-16 mb-20">
        <Container>
          <div className="mb-4">
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Open roles
            </h2>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              We're growing quickly and looking for talented people
            </p>
          </div>

          {/* No open roles UI */}
          <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
            <CardContent className="py-8 md:py-10">
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[color:var(--color-primary-50)] to-[color:var(--color-primary-100)] border border-[color:var(--color-primary-200)] flex items-center justify-center mb-6 shadow-sm shadow-[color:var(--color-primary-200)] relative group">
                  <div className="absolute inset-0 bg-[color:var(--color-primary-400)] opacity-0 group-hover:opacity-10 blur-xl transition-opacity rounded-full" />
                  <Lightbulb className="h-10 w-10 text-[color:var(--color-primary-600)] relative z-10" />
                </div>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  No open roles right now
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-neutral-600)] max-w-md">
                  We don't have any open positions at the moment, but we're
                  always looking for talented people. Check back soon or send us
                  your profile!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* General application */}
          <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm mt-6">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]" />
            <CardContent className="relative py-6">
              <div className="grid lg:grid-cols-2 gap-6 items-center">
                <div>
                  <h3
                    className="text-lg md:text-xl font-semibold"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    Don't see a perfect role?
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                    We're always excited to meet passionate people. Tell us how
                    you can help.
                  </p>
                </div>
                <div className="md:justify-end flex items-center gap-3 w-full">
                  <Link href="/contact-us" className="block w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      Send your profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </main>
  );
}
