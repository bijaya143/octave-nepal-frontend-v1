"use client";

import React from "react";
import Container from "../../components/Container";
import Card, { CardContent } from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { guestNewsletterSubscriberService } from "@/lib/services/guest";
import { CircleCheck } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const response = await guestNewsletterSubscriberService.subscribe({
        email,
      });
      if (response.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (_) {
      setStatus("error");
    }
  }

  return (
    <section id="newsletter" className="mt-12 md:mt-16 mb-8">
      <Container>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.08),transparent_60%)]" />
          <CardContent className="relative py-8 md:py-10">
            <div className="grid md:grid-cols-2 items-center gap-6 md:gap-10">
              <div>
                <h3
                  className="text-lg md:text-xl font-semibold"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Stay in the loop
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-neutral-600)]">
                  Get updates on new courses, offers, and events. No spam.
                </p>
              </div>
              <div className="w-full">
                {status === "success" ? (
                  <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                    <CircleCheck className="h-4 w-4" /> Subscribed! You’ll hear
                    from us soon.
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      aria-label="Email address"
                      className="flex-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={
                        status === "error"
                          ? "Please enter a valid email"
                          : undefined
                      }
                    />
                    <Button type="submit" disabled={status === "loading"}>
                      {status === "loading" ? "Subscribing…" : "Subscribe"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
