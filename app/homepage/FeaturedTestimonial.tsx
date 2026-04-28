"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Container from "../../components/Container";
import Card, { CardContent } from "../../components/ui/Card";
import Rating from "../../components/ui/Rating";
import { guestTestimonialService } from "@/lib/services/guest";
import { Testimonial } from "@/lib/services/admin";

// ─── skeleton ───────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm animate-pulse">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
      <CardContent className="relative py-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-[color:var(--color-neutral-200)]" />
          <div className="flex-1">
            <div className="h-4 w-1/2 rounded bg-[color:var(--color-neutral-200)] mb-1" />
            <div className="h-3 w-1/3 rounded bg-[color:var(--color-neutral-200)]" />
          </div>
        </div>
        <div className="h-4 w-24 rounded bg-[color:var(--color-neutral-200)] mb-3" />
        <div className="space-y-2 mt-3">
          <div className="h-3 w-full rounded bg-[color:var(--color-neutral-200)]" />
          <div className="h-3 w-5/6 rounded bg-[color:var(--color-neutral-200)]" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── component ──────────────────────────────────────────────────────────────

export default function FeaturedTestimonial() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    guestTestimonialService
      .list({
        isPublished: true,
        page: 1,
        limit: 3,
      })
      .then((res) => {
        if (res.success && res.data?.data) {
          setTestimonials(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch featured testimonials:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="mt-12 md:mt-16 mb-16">
      <Container>
        <div className="flex items-end justify-between mb-4">
          <h2
            className="text-xl md:text-2xl font-semibold"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            What learners say
          </h2>
          <span className="hidden sm:inline text-sm text-[color:var(--color-neutral-600)]">
            Real feedback from our community
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : testimonials.map((t) => (
                <Card
                  key={t.id}
                  className="relative overflow-hidden p-0 border border-black/5 bg-white/95 backdrop-blur-sm transition-shadow hover:shadow-lg"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
                  <CardContent className="relative py-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Image
                        src={
                          t.profilePictureKey
                            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${t.profilePictureKey}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=random`
                        }
                        alt={`${t.fullName} avatar`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                        // unoptimized
                      />
                      <div>
                        <div className="text-sm font-medium">{t.fullName}</div>
                        <div className="text-xs text-[color:var(--color-neutral-600)]">
                          {new Date(t.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                    <Rating value={t.rating} />
                    <p className="text-sm leading-relaxed mt-3 italic">
                      {t.message ? `“${t.message}”` : ""}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>
      </Container>
    </section>
  );
}
