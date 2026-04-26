import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constant";
import { Mail, Phone, MapPin } from "lucide-react";
import Container from "./Container";

const SOCIAL_LINKS = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    img: "/images/social-medias/facebook.png",
  },
  {
    href: "https://twitter.com",
    label: "X (Twitter)",
    img: "/images/social-medias/twitter.png",
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    img: "/images/social-medias/linkedin.png",
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    img: "/images/social-medias/instagram.png",
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    img: "/images/social-medias/youtube.png",
  },
];

const NAV_GROUPS = [
  {
    title: "Learn",
    links: [
      { label: "Browse Courses", href: "/courses" },
      { label: "Categories", href: "/categories" },
      { label: "Blogs", href: "/blogs" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-[color:var(--color-neutral-200)] bg-white">
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.05),transparent_65%)]" />

      <Container className="relative pt-10 pb-6">
        {/* Main link grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-6 md:gap-10">
          {/* ── Brand column ── */}
          <div className="md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-3 group"
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/images/logo/octave-nepal-only-logo-transparent.png"
                  alt={`${SITE_NAME} Logo`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                {SITE_NAME}
              </span>
            </Link>
            <p className="text-sm text-[color:var(--color-neutral-600)] leading-relaxed max-w-[22rem] lg:max-w-none">
              Courses to up skill your career.
            </p>

            {/* Social icons */}
            <div className="mt-4 flex items-center flex-wrap gap-1.5">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="h-9 w-9 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)] hover:border-[color:var(--color-neutral-300)] transition-colors"
                >
                  <Image
                    src={s.img}
                    alt=""
                    width={18}
                    height={18}
                    sizes="18px"
                    className="object-contain"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Link groups ── */}
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p
                className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-neutral-400)] mb-3"
                style={{ fontFamily: "var(--font-heading-sans)" }}
              >
                {group.title}
              </p>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[color:var(--color-neutral-700)] hover:text-[color:var(--color-primary-700)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Contact column ── */}
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--color-neutral-400)] mb-3"
              style={{ fontFamily: "var(--font-heading-sans)" }}
            >
              Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:hello@octavenepal.com"
                  className="inline-flex items-center gap-2 text-[color:var(--color-neutral-700)] hover:text-[color:var(--color-primary-700)] transition-colors break-all"
                >
                  <Mail
                    className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-neutral-400)]"
                    aria-hidden
                  />
                  hello@octavenepal.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+9779800000000"
                  className="inline-flex items-center gap-2 text-[color:var(--color-neutral-700)] hover:text-[color:var(--color-primary-700)] transition-colors"
                >
                  <Phone
                    className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-neutral-400)]"
                    aria-hidden
                  />
                  +977 980-0000000
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-[color:var(--color-neutral-500)]">
                <MapPin
                  className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-neutral-400)]"
                  aria-hidden
                />
                Jawalakhel, Lalitpur
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-8 pt-5 border-t border-[color:var(--color-neutral-200)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[color:var(--color-neutral-500)]">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </span>
          <div className="flex items-center gap-4 text-xs text-[color:var(--color-neutral-500)]">
            <Link
              href="/terms"
              className="hover:text-[color:var(--color-primary-700)] transition-colors"
            >
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/privacy"
              className="hover:text-[color:var(--color-primary-700)] transition-colors"
            >
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link
              href="/cookies"
              className="hover:text-[color:var(--color-primary-700)] transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
