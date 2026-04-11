"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Card, { CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SITE_NAME } from "@/lib/constant";
import { Linkedin, Twitter, Github, Mail, Crown } from "lucide-react";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
  expertise?: string[];
};

const leadership: TeamMember[] = [
  {
    name: "Aarav Shrestha",
    role: "Founder & CEO",
    bio: "Product-minded engineer passionate about elegant learning experiences.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=640&q=80",
    socials: {
      linkedin: "https://www.linkedin.com/",
      twitter: "https://twitter.com/",
      email: "mailto:hello@octave.nepal",
    },
    expertise: ["Strategy", "Product", "Growth"],
  },
  {
    name: "Prerana Karki",
    role: "Head of Curriculum",
    bio: "Former senior developer crafting outcome-driven, practical course roadmaps.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=80",
    socials: {
      linkedin: "https://www.linkedin.com/",
      twitter: "https://twitter.com/",
    },
    expertise: ["Curriculum", "Assessment", "Teaching"],
  },
  {
    name: "Sujan Gurung",
    role: "Engineering Lead",
    bio: "Loves clean code, strong fundamentals, and mentoring new developers.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=640&q=80",
    socials: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
    expertise: ["Architecture", "Mentorship", "Reliability"],
  },
  {
    name: "Riya Acharya",
    role: "Design Lead",
    bio: "Minimalist design, maximal clarity. Turns complex ideas into friendly UI.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=640&q=80",
    socials: {
      linkedin: "https://www.linkedin.com/",
      twitter: "https://twitter.com/",
    },
    expertise: ["Design Systems", "UX", "Accessibility"],
  },
  {
    name: "Krishna Adhikari",
    role: "Community Manager",
    bio: "Builds welcoming spaces, hosts live sessions, and keeps learners motivated.",
    image:
      "https://images.unsplash.com/photo-1545996124-0501ebae84d0?auto=format&fit=crop&w=640&q=80",
    socials: {
      linkedin: "https://www.linkedin.com/",
      email: "mailto:support@octave.nepal",
    },
    expertise: ["Community", "Events", "Support"],
  },
];

const instructors: TeamMember[] = [
  {
    name: "Asmita Rai",
    role: "Instructor",
    bio: "Focus on fundamentals, clear explanations, and project-based learning.",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=640&q=80",
    socials: {
      twitter: "https://twitter.com/",
      github: "https://github.com/",
    },
    expertise: ["Frontend", "React", "UI"],
  },
  {
    name: "Bibek Karki",
    role: "Instructor",
    bio: "Backend engineer who loves teaching databases and APIs with clarity.",
    image:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=640&q=80",
    socials: {
      github: "https://github.com/",
      linkedin: "https://www.linkedin.com/",
    },
    expertise: ["Node.js", "Databases", "APIs"],
  },
  {
    name: "Sneha Shrestha",
    role: "Instructor",
    bio: "Mobile developer focused on React Native and delightful UX patterns.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=80",
    socials: {
      twitter: "https://twitter.com/",
    },
    expertise: ["React Native", "UX", "Performance"],
  },
  {
    name: "Prakash Bista",
    role: "Instructor",
    bio: "Cloud and DevOps specialist turning infra concepts into simple steps.",
    image:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=640&q=80",
    socials: {
      linkedin: "https://www.linkedin.com/",
    },
    expertise: ["AWS", "Docker", "CI/CD"],
  },
];

export default function TeamContent() {
  return (
    <main>
      <section className="py-5 md:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
        <Container>
          <div className="relative">
            {/* Header */}
            <div className="mb-3">
              <Badge variant="outline">Meet the team</Badge>
            </div>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              The people behind {SITE_NAME}
            </h1>
            <p className="mt-2 text-[color:var(--color-neutral-600)] text-sm md:text-base max-w-3xl">
              A focused leadership team shaping vision, craft, and community.
            </p>

            {/* Leadership grid */}
            <div className="mt-7 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {leadership.map((m, i) => (
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="group"
                >
                  <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(59,130,246,0.35)] via-[rgba(147,51,234,0.25)] to-[rgba(16,185,129,0.3)]">
                    <Card className="p-0 overflow-hidden rounded-2xl border-transparent bg-white/90 backdrop-blur-sm shadow-sm">
                      <div className="relative h-[16rem] sm:h-[18rem] md:h-[21rem] w-full">
                        <Image
                          src={m.image}
                          alt={`${m.name} portrait`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 25vw"
                          className="object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-60" />
                        <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_60%)] blur-xl" />
                      </div>
                      <CardContent className="py-4 sm:py-5">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div
                            className="text-sm sm:text-base md:text-lg font-semibold break-words"
                            style={{ fontFamily: "var(--font-heading-sans)" }}
                          >
                            {m.name}
                          </div>
                        </div>
                        <div className="text-[11px] sm:text-sm text-[color:var(--color-primary-700)] mt-0.5 sm:mt-1">
                          {m.role}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Instructors */}
            <div className="mt-12 md:mt-14">
              <div className="mb-3">
                <Badge variant="outline">Instructors</Badge>
              </div>
              <h2
                className="text-xl md:text-2xl font-semibold"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                Learn from practitioners
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-neutral-600)]">
                Expert mentors with real-world experience and clear teaching
                styles.
              </p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {instructors.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="group"
                  >
                    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(99,102,241,0.25)] via-[rgba(59,130,246,0.22)] to-[rgba(16,185,129,0.22)]">
                      <Card className="p-0 overflow-hidden rounded-2xl border-transparent bg-white/95 backdrop-blur-sm shadow-sm">
                        <div className="relative h-[13.5rem] sm:h-[15.5rem] md:h-[16rem] w-full">
                          <Image
                            src={m.image}
                            alt={`${m.name} portrait`}
                            fill
                            sizes="(max-width: 1280px) 100vw, 25vw"
                            className="object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-50" />
                          <div className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_60%)] blur-xl" />
                        </div>
                        <CardContent className="py-3.5 sm:py-5">
                          <div
                            className="text-sm sm:text-base md:text-lg font-semibold"
                            style={{ fontFamily: "var(--font-heading-sans)" }}
                          >
                            {m.name}
                          </div>
                          <div className="text-[11px] sm:text-xs text-[color:var(--color-primary-700)] mt-0.5 sm:mt-1">
                            {m.role}
                          </div>
                          {/* <div className="h-px bg-[color:var(--color-neutral-200)] my-4" /> */}
                          <div className="mt-2.5 rounded-lg border border-[color:var(--color-neutral-200)]/70 bg-[color:var(--color-neutral-50)]/60 px-2.5 sm:px-3 py-1.5 sm:py-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {m.socials?.linkedin && (
                              <Link
                                href={m.socials.linkedin}
                                aria-label={`${m.name} on LinkedIn`}
                                className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                              >
                                <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Link>
                            )}
                            {m.socials?.twitter && (
                              <Link
                                href={m.socials.twitter}
                                aria-label={`${m.name} on X/Twitter`}
                                className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                              >
                                <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Link>
                            )}
                            {m.socials?.github && (
                              <Link
                                href={m.socials.github}
                                aria-label={`${m.name} on GitHub`}
                                className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                              >
                                <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Link>
                            )}
                            {m.socials?.email && (
                              <Link
                                href={m.socials.email}
                                aria-label={`Email ${m.name}`}
                                className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                              >
                                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Link>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 md:mt-14">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10),transparent_60%)]" />
                <CardContent className="relative py-7 md:py-8">
                  <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10">
                    <div>
                      <h2
                        className="text-lg md:text-xl font-semibold"
                        style={{ fontFamily: "var(--font-heading-sans)" }}
                      >
                        We’re hiring
                      </h2>
                      <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                        Join us in building modern, outcome-focused courses for
                        learners across Nepal.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:justify-end">
                      <Link href="/careers" className="block w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto whitespace-nowrap">
                          See open roles
                        </Button>
                      </Link>
                      <Link href="/contact" className="block w-full sm:w-auto">
                        <Button
                          size="lg"
                          variant="secondary"
                          className="w-full sm:w-auto whitespace-nowrap"
                        >
                          Partner with us
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
