"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MessageSquareOff } from "lucide-react";

import Rating from "../../components/ui/Rating";
import Container from "../../components/Container";
import Button from "../../components/ui/Button";
import { guestTestimonialService } from "@/lib/services/guest";
import { Testimonial } from "@/lib/services/admin/types";

export default function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    guestTestimonialService
      .list({
        isPublished: true,
        page,
        limit: pageSize,
      })
      .then((res) => {
        if (res.success && res.data) {
          setTestimonials(res.data.data);
          if (res.data.meta) {
            setPagination(res.data.meta);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch testimonials:", err);
      })
      .finally(() => setIsLoading(false));
  }, [page]);

  return (
    <main>
      <Container className="py-5 md:py-10">
        <SimpleTestimonials
          items={testimonials}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          total={pagination?.total || 0}
        />
      </Container>
    </main>
  );
}

function SimpleTestimonials({
  items,
  isLoading,
  page,
  setPage,
  pageSize,
  total,
}: {
  items: Testimonial[];
  isLoading: boolean;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  total: number;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="relative">
      <div className="text-center mb-5">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-semibold"
          style={{ fontFamily: "var(--font-heading-sans)" }}
        >
          What learners say
        </h1>
        <p className="mt-2 text-sm md:text-base text-[color:var(--color-neutral-600)]">
          Selected testimonials from our community.
        </p>
        <div className="h-px bg-[color:var(--color-neutral-200)] mt-4" />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {!isLoading &&
          items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="rounded-xl border border-[color:var(--color-neutral-200)] bg-white p-5 hover:shadow-sm transition-shadow h-full">
                <h2
                  className="text-base sm:text-lg font-semibold leading-tight line-clamp-4"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  {t.message ? `“${t.message}”` : ""}
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <Image
                    src={
                      t.profilePictureKey
                        ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${t.profilePictureKey}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=random`
                    }
                    alt={`${t.fullName} avatar`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                    // unoptimized
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{t.fullName}</span>
                    <span className="text-xs text-[color:var(--color-neutral-600)]">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="ml-auto opacity-80">
                    <Rating value={t.rating} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--color-neutral-200)] bg-white p-5 animate-pulse h-[160px]"
            >
              <div className="h-4 w-full bg-[color:var(--color-neutral-100)] rounded mb-3" />
              <div className="h-4 w-2/3 bg-[color:var(--color-neutral-100)] rounded mb-8" />
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[color:var(--color-neutral-100)]" />
                <div className="flex-1">
                  <div className="h-3 w-1/3 bg-[color:var(--color-neutral-100)] rounded mb-2" />
                  <div className="h-2 w-1/4 bg-[color:var(--color-neutral-100)] rounded" />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <div className="mt-16 mb-24 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="h-20 w-20 rounded-full bg-[color:var(--color-neutral-50)] border border-[color:var(--color-neutral-100)] flex items-center justify-center mb-6 shadow-sm">
            <MessageSquareOff
              size={32}
              className="text-[color:var(--color-neutral-400)]"
            />
          </div>
          <h3
            className="text-xl font-semibold text-[color:var(--color-neutral-900)] mb-2"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            No testimonials yet
          </h3>
          <p className="text-sm text-[color:var(--color-neutral-600)] max-w-sm leading-relaxed">
            We haven't received any testimonials for this view yet. Check back
            later to see what our community is saying!
          </p>
        </div>
      )}

      {/* Pagination component */}
      {!isLoading && total > pageSize && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[color:var(--color-neutral-200)] pt-6">
          <p className="text-sm text-[color:var(--color-neutral-500)] text-center sm:text-left">
            Showing{" "}
            <span className="font-medium text-[color:var(--color-neutral-900)]">
              {total === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, total)}
            </span>{" "}
            of {total} testimonials
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-3"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="text-sm font-medium text-[color:var(--color-neutral-600)] px-1 whitespace-nowrap">
              {page} of {pageCount}
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 px-3"
              onClick={() => setPage(page + 1)}
              disabled={page === pageCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
