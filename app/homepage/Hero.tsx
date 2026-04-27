import Image from "next/image";
import Link from "next/link";
import Container from "../../components/Container";
import Button from "../../components/ui/Button";
import { BookOpen, LayoutGrid } from "lucide-react";
import Card, { CardContent } from "../../components/ui/Card";

export default function Hero() {
  return (
    <section className="pt-6 sm:pt-16 md:pt-8">
      <Container>
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12">
          <div>
            <h1
              className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance mb-4 sm:mb-6 max-w-[28ch] md:max-w-none text-center sm:text-left"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              <span className="block sm:hidden">
                Nepal's First <span className="gradient-text">AI-Powered</span>{" "}
                Online Learning Platform
              </span>
              <span className="hidden md:block lg:hidden text-xl md:text-2xl lg:text-3xl">
                Nepal's First <span className="gradient-text">AI-Powered</span>{" "}
                Online Learning Platform.
              </span>
              <div className="hidden lg:block">
                <span className="block">
                  Nepal's First{" "}
                  <span className="gradient-text">AI-Powered</span> Online
                  Learning Platform.
                </span>
                <span className="block">
                  Personalized{" "}
                  <span className="gradient-text">AI Guidance</span>.
                </span>
                <span className="block">
                  Real <span className="gradient-text">Results</span>.
                </span>
              </div>
              <span className="pointer-events-none absolute -bottom-2 left-0 h-[3px] w-24 sm:w-28 md:w-32 rounded-full bg-gradient-to-r from-primary-600 to-indigo-500/60 blur-[0.5px] hidden sm:block"></span>
            </h1>
            <p className="text-[color:var(--color-neutral-600)] text-base md:text-lg text-pretty max-w-xl mb-6 text-center sm:text-left">
              Cohort based courses by industry experts. Flexible schedules, and
              easy local payments
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/courses">
                <Button size="lg" block>
                  <BookOpen size={18} className="mr-2" aria-hidden="true" />
                  <span className="hidden lg:inline">Browse{"\u00A0"}</span>
                  Courses
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="secondary" block>
                  <LayoutGrid size={18} className="mr-2" aria-hidden="true" />
                  <span className="hidden lg:inline">Explore{"\u00A0"}</span>
                  Categories
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Card className="p-0 overflow-hidden">
              <Image
                src="/images/hero/hero.png"
                alt="Learning hero"
                width={1600}
                height={900}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full h-auto"
                priority
              />
              <CardContent className="py-5">
                <p className="text-sm text-[color:var(--color-neutral-600)]">
                  Trusted by 1k+ learners worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
