import Image from "next/image";
import Link from "next/link";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  Award,
  Target,
  HeartHandshake,
  BookOpen,
  Star,
  GraduationCap,
} from "lucide-react";
import { SITE_NAME } from "@/lib/constant";
import type { Metadata } from "next";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "About Us - " + SITE_NAME,
  description: "Learn more about " + SITE_NAME + " and our mission.",
};

export default function AboutPage() {
  return (
    <main>
      {/* About section */}
      <section className="py-5 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <Container>
          <div className="relative grid lg:grid-cols-2 items-center gap-6 lg:gap-12">
            <div>
              <div className="mb-3">
                <Badge variant="outline">Our story</Badge>
              </div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                About {SITE_NAME}
              </h1>
              <p className="text-[color:var(--color-neutral-600)] text-sm sm:text-base md:text-lg lg:text-xl mb-6">
                We are a modern online learning platform in Nepal, focused on
                delivering elegant, practical courses crafted by industry
                experts. Our mission is to help learners build in-demand skills
                through delightful user experiences and community-driven
                learning.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/courses" className="block w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/contact" className="block w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Get in touch
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <Card className="p-0 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=80"
                  alt="Students collaborating"
                  width={1600}
                  height={900}
                  sizes="100vw"
                  className="w-full h-auto"
                  priority
                />
                <CardContent className="py-5">
                  <p className="text-sm text-[color:var(--color-neutral-600)]">
                    Learning that blends clarity, community, and craftsmanship
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats section */}
      <section className="mt-10 md:mt-14">
        <Container>
          <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
            <CardContent className="py-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Learners */}
                <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                      <GraduationCap size={18} aria-hidden />
                    </div>
                    <div
                      className="mt-2 text-2xl md:text-3xl font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      10k+
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-blue-700/80">
                      Learners
                    </div>
                  </div>
                </div>
                {/* Courses */}
                <div className="rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                      <BookOpen size={18} aria-hidden />
                    </div>
                    <div
                      className="mt-2 text-2xl md:text-3xl font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      30+
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-emerald-700/80">
                      Courses
                    </div>
                  </div>
                </div>
                {/* Instructors */}
                <div className="rounded-lg border border-violet-200 bg-gradient-to-br from-violet-50 to-violet-100 p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-lg bg-violet-600/10 text-violet-600 flex items-center justify-center">
                      <Award size={18} aria-hidden />
                    </div>
                    <div
                      className="mt-2 text-2xl md:text-3xl font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      40+
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-violet-700/80">
                      Instructors
                    </div>
                  </div>
                </div>
                {/* Rating */}
                <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Star size={18} aria-hidden />
                    </div>
                    <div
                      className="mt-2 text-2xl md:text-3xl font-semibold"
                      style={{ fontFamily: "var(--font-heading-sans)" }}
                    >
                      4.8/5
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wide text-amber-700/80">
                      Average rating
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      {/* Our values section */}
      <section className="mt-12 md:mt-16">
        <Container>
          <div className="mb-4">
            <h2
              className="text-xl md:text-2xl font-semibold"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Our values
            </h2>
            <p className="text-sm text-[color:var(--color-neutral-600)] mt-1">
              Principles that shape our courses and community
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-4 md:gap-5">
            <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
              <CardContent className="py-6">
                <div className="h-10 w-10 rounded-full bg-[rgba(59,130,246,0.08)] text-[color:var(--color-primary-700)] flex items-center justify-center">
                  <Award className="h-5 w-5" aria-hidden={true} />
                </div>
                <h3
                  className="mt-3 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Expert-led
                </h3>
                <p className="text-sm text-[color:var(--color-neutral-700)] mt-2 leading-relaxed">
                  Courses are designed and reviewed by practitioners with
                  real-world experience, with a focus on clarity and
                  applicability.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
              <CardContent className="py-6">
                <div className="h-10 w-10 rounded-full bg-[rgba(59,130,246,0.08)] text-[color:var(--color-primary-700)] flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5" aria-hidden={true} />
                </div>
                <h3
                  className="mt-3 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Community-first
                </h3>
                <p className="text-sm text-[color:var(--color-neutral-700)] mt-2 leading-relaxed">
                  Learn together through live cohorts, Q&A support, and a
                  supportive community of peers and mentors.
                </p>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm">
              <CardContent className="py-6">
                <div className="h-10 w-10 rounded-full bg-[rgba(59,130,246,0.08)] text-[color:var(--color-primary-700)] flex items-center justify-center">
                  <Target className="h-5 w-5" aria-hidden={true} />
                </div>
                <h3
                  className="mt-3 text-lg font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Outcomes-driven
                </h3>
                <p className="text-sm text-[color:var(--color-neutral-700)] mt-2 leading-relaxed">
                  Practical projects and assessments help you build a portfolio
                  and confidence to apply your skills professionally.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="mt-12 md:mt-16 mb-20">
        <Container>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]" />
            <CardContent className="relative py-8 md:py-10">
              <div className="grid lg:grid-cols-2 items-center gap-6 lg:gap-10">
                <div>
                  <h3
                    className="text-lg md:text-xl font-semibold"
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    Ready to grow your skills?
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                    Join thousands of learners leveling up with high-quality,
                    practical courses.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:justify-end">
                  <Link href="/courses" className="block w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto">
                      Explore courses
                    </Button>
                  </Link>
                  <Link href="/contact" className="block w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Talk to us
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
