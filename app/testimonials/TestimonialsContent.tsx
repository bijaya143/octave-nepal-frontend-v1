"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
 
import Rating from "../../components/ui/Rating";
import Container from "../../components/Container";

const testimonials = [
  {
    quote:
      "The UI is beautiful and the content is top-notch. Highly recommended!",
    name: "Aarav Shrestha",
    date: "Oct 2025",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote:
      "Instructors explain complex topics clearly. I landed a better job after these courses.",
    name: "Prerana Karki",
    date: "Sep 2025",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote:
      "Practical projects and elegant design made learning enjoyable and effective.",
    name: "Sujan Gurung",
    date: "Aug 2025",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    rating: 4.5,
  },
  {
    quote: "Great pacing and clear roadmap. I finally feel confident building apps.",
    name: "Nirajan Thapa",
    date: "Jul 2025",
    avatar:
      "https://images.unsplash.com/photo-1545996124-0501ebae84d0?auto=format&fit=crop&w=256&q=80",
    rating: 4.5,
  },
  {
    quote: "Assignments mirror real-world tasks. The feedback was actually useful!",
    name: "Riya Acharya",
    date: "Jun 2025",
    avatar:
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote: "Loved the minimalist design and the focus on fundamentals.",
    name: "Bibek Karki",
    date: "May 2025",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=256&q=80",
    rating: 4,
  },
  {
    quote: "Concise videos, strong projects, and friendly community.",
    name: "Asmita Rai",
    date: "Apr 2025",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote: "I switched careers thanks to these courses. Worth every rupee.",
    name: "Krishna Adhikari",
    date: "Mar 2025",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    quote: "Simple interface that doesn’t get in the way of learning.",
    name: "Sneha Shrestha",
    date: "Feb 2025",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    rating: 4.5,
  },
  {
    quote: "Best value platform I’ve used. Practical, elegant, and effective.",
    name: "Prakash Bista",
    date: "Jan 2025",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
];

export default function TestimonialsContent() {
  return (
    <main>
      <Container className="py-10">
        <SimpleTestimonials items={testimonials} />
      </Container>
    </main>
  );
}

type Testimonial = (typeof testimonials)[number];

function SimpleTestimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="relative px-4">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>What learners say</h1>
          <p className="mt-2 text-sm md:text-base text-[color:var(--color-neutral-600)]">Selected testimonials from our community.</p>
          <div className="h-px bg-[color:var(--color-neutral-200)] mt-6" />
          
        </div>
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 md:gap-x-10 gap-y-12 md:gap-y-16">
          {items.map((t, i) => {
            const offsetClasses = ["", "md:mt-8", "md:-mt-6", "", "md:mt-6", "md:-mt-4"][i % 6];
            const wide = i % 6 === 0; // occasional wide tile on xl
            const containerClasses = `${offsetClasses} ${wide ? "xl:col-span-2" : ""}`.trim();
            const headingClamp = wide ? "md:text-2xl lg:text-3xl line-clamp-2" : "line-clamp-3";
            return (
              <motion.div
                key={t.name + i}
                className={containerClasses}
                initial={{ opacity: 1, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="rounded-xl border border-[color:var(--color-neutral-200)] bg-white p-5 md:p-6 hover:shadow-sm transition-shadow">
                  <h2
                    className={`text-base sm:text-lg md:text-xl font-semibold leading-tight ${headingClamp}`}
                    style={{ fontFamily: "var(--font-heading-sans)" }}
                  >
                    “{t.quote}”
                  </h2>
                  <div className="mt-3 flex items-center gap-3">
                    <Image src={t.avatar} alt={`${t.name} avatar`} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{t.name}</span>
                      <span className="text-xs text-[color:var(--color-neutral-600)]">{t.date}</span>
                    </div>
                    <div className="ml-auto opacity-80">
                      <Rating value={t.rating} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


