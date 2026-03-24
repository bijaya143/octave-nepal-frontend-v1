import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/lib/constant";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-neutral-200)] mt-16">
      <Container className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 items-start gap-6 md:gap-8">
        <div className="sm:col-span-2 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-[color:var(--color-primary-600)]"></div>
            <span className="font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>{SITE_NAME}</span>
          </div>
          <p className="text-sm text-[color:var(--color-neutral-600)]">Courses to up skill your career.</p>
          <div className="mt-4 flex items-center gap-1">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
            >
              <Image src="/images/social-medias/facebook.png" alt="" width={24} height={24} sizes="24px" className="object-contain" aria-hidden />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
            >
              <Image src="/images/social-medias/twitter.png" alt="" width={24} height={24} sizes="24px" className="object-contain" aria-hidden />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
            >
              <Image src="/images/social-medias/linkedin.png" alt="" width={24} height={24} sizes="24px" className="object-contain" aria-hidden />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
            >
              <Image src="/images/social-medias/instagram.png" alt="" width={24} height={24} sizes="24px" className="object-contain" aria-hidden />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="h-10 w-10 rounded-full inline-flex items-center justify-center border border-[color:var(--color-neutral-200)] bg-white shadow-xs hover:bg-[color:var(--color-neutral-50)]"
            >
              <Image src="/images/social-medias/youtube.png" alt="" width={24} height={24} sizes="24px" className="object-contain" aria-hidden />
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Learn</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/courses" className="hover:text-[color:var(--color-primary-700)]">Browse Courses</Link></li>
            <li><Link href="/categories" className="hover:text-[color:var(--color-primary-700)]">Categories</Link></li>
            <li><Link href="/blogs" className="hover:text-[color:var(--color-primary-700)]">Blogs</Link></li>
            <li><Link href="/faq" className="hover:text-[color:var(--color-primary-700)]">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-[color:var(--color-primary-700)]">About</Link></li>
            <li><Link href="/team" className="hover:text-[color:var(--color-primary-700)]">Our Team</Link></li>
            <li><Link href="/careers" className="hover:text-[color:var(--color-primary-700)]">Careers</Link></li>
            <li><Link href="/contact" className="hover:text-[color:var(--color-primary-700)]">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Legal</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-[color:var(--color-primary-700)]">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-[color:var(--color-primary-700)]">Privacy</Link></li>
            <li><Link href="/cookies" className="hover:text-[color:var(--color-primary-700)]">Cookies</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-[color:var(--color-neutral-700)]">
            <li>
              <a href="mailto:hello@octavenepal.com" className="hover:text-[color:var(--color-primary-700)]">hello@octavenepal.com</a>
            </li>
            <li>
              <a href="tel:+9779800000000" className="hover:text-[color:var(--color-primary-700)]">+977 980-0000000</a>
            </li>
            <li>
              <span>Jawalakhel, Lalitpur</span>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-[color:var(--color-neutral-200)]">
        <Container className="py-4 text-xs text-[color:var(--color-neutral-600)] flex items-center justify-center">
          <span className="hover:text-[color:var(--color-primary-700)]">© {new Date().getFullYear()} {SITE_NAME}</span>
        </Container>
      </div>
    </footer>
  );
}


