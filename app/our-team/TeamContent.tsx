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
import { Mail } from "lucide-react";
import { guestManagementTeamService } from "@/lib/services/guest/management-team";
import { guestInstructorService } from "@/lib/services/guest/instructor";

type TeamMember = {
  name: string;
  role: string;
  bio?: string;
  image: string;
  socials?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
    email?: string;
  };
  expertise?: string[];
};

const leadershipFallback: TeamMember[] = [
  {
    name: "Pradeep Shyangtan",
    role: "Chairman",
    image: "/images/team/pradeep-shyangtan.jpg",
  },
  {
    name: "Bijaya Majhi",
    role: "Founder & Creator",
    image: "/images/team/bijaya-majhi.jpg",
  },
];

export default function TeamContent() {
  const [leadership, setLeadership] = React.useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [instructors, setInstructors] = React.useState<TeamMember[]>([]);
  const [isInstructorsLoading, setIsInstructorsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await guestManagementTeamService.list({
          isPublished: true,
          limit: 50,
          page: 1,
        });
        if (response.success && response.data.data.length > 0) {
          const dynamicTeam = response.data.data.map((member) => ({
            name: member.name,
            role: member.position,
            image: member.imageKey
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${member.imageKey}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  member.name,
                )}&background=random`,
            socials: member.email ? { email: member.email } : undefined,
          }));
          setLeadership(dynamicTeam);
        } else {
          setLeadership(leadershipFallback);
        }
      } catch (error) {
        console.error("Failed to fetch management team:", error);
        setLeadership(leadershipFallback);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchInstructors = async () => {
      try {
        const response = await guestInstructorService.list({
          isFeatured: true,
          limit: 8,
          page: 1,
        });
        if (response.success && response.data.data.length > 0) {
          const dynamicInstructors = response.data.data.map((inst) => {
            const nameParts = [
              inst.firstName,
              inst.middleName,
              inst.lastName,
            ].filter(Boolean);
            const fullName = nameParts.join(" ") || "Instructor";

            const socialsObj: any = { email: inst.email };
            inst.socialLinks?.forEach((link) => {
              const nameLower = link.name.toLowerCase();
              if (nameLower.includes("website")) socialsObj.website = link.url;
              if (nameLower.includes("linkedin"))
                socialsObj.linkedin = link.url;
              if (
                nameLower.includes("twitter") ||
                nameLower === "x" ||
                nameLower.includes("x.com")
              )
                socialsObj.twitter = link.url;
              if (nameLower.includes("facebook"))
                socialsObj.facebook = link.url;
              if (nameLower.includes("instagram"))
                socialsObj.instagram = link.url;
              if (nameLower.includes("youtube")) socialsObj.youtube = link.url;
              if (nameLower.includes("github")) socialsObj.github = link.url;
            });

            return {
              name: fullName,
              role: inst.role || "Instructor",
              image: inst.profilePictureKey
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${inst.profilePictureKey}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
              socials:
                Object.keys(socialsObj).length > 0 ? socialsObj : undefined,
            };
          });
          setInstructors(dynamicInstructors);
        } else {
          setInstructors([]);
        }
      } catch (error) {
        console.error("Failed to fetch instructors:", error);
        setInstructors([]);
      } finally {
        setIsInstructorsLoading(false);
      }
    };

    fetchTeam();
    fetchInstructors();
  }, []);

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
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(59,130,246,0.35)] via-[rgba(147,51,234,0.25)] to-[rgba(16,185,129,0.3)] ${i >= 2 ? "hidden lg:block" : ""}`}
                    >
                      <Card className="h-full p-0 overflow-hidden rounded-2xl border-transparent bg-white/90 backdrop-blur-sm shadow-sm">
                        <div className="relative h-[16rem] sm:h-[18rem] md:h-[21rem] w-full bg-[color:var(--color-neutral-100)] animate-pulse" />
                        <CardContent className="px-3 sm:px-6 py-4 sm:py-5">
                          <div className="h-4 sm:h-5 bg-[color:var(--color-neutral-200)] rounded w-3/4 mb-2 animate-pulse"></div>
                          <div className="h-3 sm:h-4 bg-[color:var(--color-neutral-100)] rounded w-1/2 animate-pulse"></div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                : leadership.map((m, i) => (
                    <div
                      key={m.name}
                      className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(59,130,246,0.35)] via-[rgba(147,51,234,0.25)] to-[rgba(16,185,129,0.3)]"
                    >
                      <Card className="h-full p-0 overflow-hidden rounded-2xl border-transparent bg-white/90 backdrop-blur-sm shadow-sm">
                        <div className="relative h-[16rem] sm:h-[18rem] md:h-[21rem] w-full">
                          <Image
                            src={m.image}
                            alt={`${m.name} portrait`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 25vw"
                            className="object-cover"
                            unoptimized={m.image.startsWith("http")}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-60" />
                          <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_60%)] blur-xl" />
                        </div>
                        <CardContent className="px-3 sm:px-6 py-4 sm:py-5">
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
                  ))}
            </div>

            {/* Instructors */}
            {(isInstructorsLoading || instructors.length > 0) && (
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
                  {isInstructorsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={`relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(99,102,241,0.25)] via-[rgba(59,130,246,0.22)] to-[rgba(16,185,129,0.22)] ${i >= 2 ? "hidden md:block" : ""}`}
                        >
                          <Card className="h-full p-0 overflow-hidden rounded-2xl border-transparent bg-white/95 backdrop-blur-sm shadow-sm">
                            <div className="relative h-[13.5rem] sm:h-[15.5rem] md:h-[16rem] w-full bg-[color:var(--color-neutral-100)] animate-pulse" />
                            <CardContent className="px-3 sm:px-6 py-3.5 sm:py-5">
                              <div className="h-4 sm:h-5 bg-[color:var(--color-neutral-200)] rounded w-3/4 mb-2 animate-pulse"></div>
                              <div className="h-3 sm:h-4 bg-[color:var(--color-neutral-100)] rounded w-1/2 mb-4 animate-pulse"></div>
                              <div className="h-8 bg-[color:var(--color-neutral-100)] rounded w-full animate-pulse"></div>
                            </CardContent>
                          </Card>
                        </div>
                      ))
                    : instructors.map((m, i) => (
                        <motion.div
                          key={m.name}
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, delay: i * 0.05 }}
                          viewport={{ once: true, amount: 0.2 }}
                          className="group h-full"
                        >
                          <div className="relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-[rgba(99,102,241,0.25)] via-[rgba(59,130,246,0.22)] to-[rgba(16,185,129,0.22)]">
                            <Card className="h-full p-0 overflow-hidden rounded-2xl border-transparent bg-white/95 backdrop-blur-sm shadow-sm">
                              <div className="relative h-[13.5rem] sm:h-[15.5rem] md:h-[16rem] w-full">
                                <Image
                                  src={m.image}
                                  alt={`${m.name} portrait`}
                                  fill
                                  sizes="(max-width: 1280px) 100vw, 25vw"
                                  className="object-cover"
                                  unoptimized={m.image.startsWith("http")}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 opacity-50" />
                                <div className="pointer-events-none absolute -top-10 -left-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_60%)] blur-xl" />
                              </div>
                              <CardContent className="px-3 sm:px-6 py-3.5 sm:py-5">
                                <div
                                  className="text-sm sm:text-base md:text-lg font-semibold"
                                  style={{
                                    fontFamily: "var(--font-heading-sans)",
                                  }}
                                >
                                  {m.name}
                                </div>
                                <div className="text-[11px] sm:text-xs text-[color:var(--color-primary-700)] mt-0.5 sm:mt-1">
                                  {m.role}
                                </div>
                                {/* <div className="h-px bg-[color:var(--color-neutral-200)] my-4" /> */}
                                {m.socials && (
                                  <div className="mt-2.5 rounded-lg border border-[color:var(--color-neutral-200)]/70 bg-[color:var(--color-neutral-50)]/60 px-2.5 sm:px-3 py-1.5 sm:py-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    {m.socials.website && (
                                      <Link
                                        href={m.socials.website}
                                        aria-label={`${m.name}'s Website`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/internet.png"
                                          alt="Website"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.linkedin && (
                                      <Link
                                        href={m.socials.linkedin}
                                        aria-label={`${m.name} on LinkedIn`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/linkedin.png"
                                          alt="LinkedIn"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.twitter && (
                                      <Link
                                        href={m.socials.twitter}
                                        aria-label={`${m.name} on X/Twitter`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/twitter.png"
                                          alt="X/Twitter"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.facebook && (
                                      <Link
                                        href={m.socials.facebook}
                                        aria-label={`${m.name} on Facebook`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/facebook.png"
                                          alt="Facebook"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.instagram && (
                                      <Link
                                        href={m.socials.instagram}
                                        aria-label={`${m.name} on Instagram`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/instagram.png"
                                          alt="Instagram"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.youtube && (
                                      <Link
                                        href={m.socials.youtube}
                                        aria-label={`${m.name} on YouTube`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/youtube.png"
                                          alt="YouTube"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.github && (
                                      <Link
                                        href={m.socials.github}
                                        aria-label={`${m.name} on GitHub`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Image
                                          src="/images/social-medias/github.png"
                                          alt="GitHub"
                                          width={16}
                                          height={16}
                                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                                        />
                                      </Link>
                                    )}
                                    {m.socials.email && (
                                      <Link
                                        href={`mailto:${m.socials.email}`}
                                        aria-label={`Email ${m.name}`}
                                        className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                                      >
                                        <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                      </Link>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </motion.div>
                      ))}
                </div>
              </div>
            )}

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
                        <Button
                          size="lg"
                          className="w-full sm:w-auto whitespace-nowrap"
                        >
                          See open roles
                        </Button>
                      </Link>
                      <Link
                        href="/contact-us"
                        className="block w-full sm:w-auto"
                      >
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
