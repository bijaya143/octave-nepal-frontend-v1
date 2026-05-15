"use client";
import React from "react";
import { cn } from "@/lib/cn";
import Card, { CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import Container from "@/components/Container";
import { guestContactMessageService } from "@/lib/services/guest/contact-message";
import { toast } from "sonner";

export default function ContactContent() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return;
    }

    setErrors({});

    setLoading(true);
    try {
      const payload: any = {
        fullName: name,
        email,
        message,
      };

      if (subject.trim()) {
        payload.subject = subject.trim();
      }

      const response = await guestContactMessageService.create(payload);

      if (response.success) {
        toast.success("Your message has been sent successfully!");
        setSubmitted(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(response.error?.message || "Failed to send message.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Container className="py-5 md:py-10">
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading-sans)" }}
          >
            Contact us
          </h1>
          <p className="hidden sm:block mt-2 text-sm text-[color:var(--color-neutral-600)]">
            Have questions about courses, cohorts, or payments? Send us a
            message and we'll get back soon.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_65%)]" />
              <CardContent className="relative py-6">
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <Input
                    label="Full name"
                    placeholder="Your name"
                    value={name}
                    error={errors.name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    error={errors.email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    required
                  />
                  <Input
                    className="sm:col-span-2"
                    label="Subject (optional)"
                    placeholder="How can we help?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <div className="sm:col-span-2 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[color:var(--foreground)]">
                        Message
                        <span className="ml-1 text-red-600" aria-hidden>
                          *
                        </span>
                      </label>
                      <span
                        className={`text-xs font-medium ${message.length >= 250 ? "text-[color:var(--color-error-500)]" : "text-[color:var(--color-neutral-500)]"}`}
                      >
                        {message.length} / 250
                      </span>
                    </div>
                    <textarea
                      placeholder="Write your message..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message)
                          setErrors((prev) => ({ ...prev, message: "" }));
                      }}
                      maxLength={250}
                      className={cn(
                        "min-h-32 rounded-lg bg-white border px-4 py-3 text-[color:var(--foreground)] placeholder:text-[color:var(--color-neutral-400)] shadow-xs transition-all",
                        errors.message
                          ? "border-red-400 focus:border-red-500 focus:shadow-sm"
                          : "border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)] focus:shadow-sm",
                      )}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600">{errors.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
                    <Button
                      type="submit"
                      size="lg"
                      block
                      className="sm:w-auto"
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {loading ? "Sending..." : "Send message"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(59,130,246,0.08),transparent_60%)]" />
              <CardContent className="relative py-5">
                <h2
                  className="text-base md:text-lg font-semibold mb-2"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Get in touch
                </h2>
                <div className="mt-3 space-y-3 text-sm">
                  <a
                    href="mailto:hello@octavenepal.com"
                    className="group flex items-center gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-white/95 backdrop-blur px-3 py-3"
                  >
                    <div className="shrink-0 h-10 w-10 rounded-full ring-1 ring-black/5 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-[color:var(--color-primary-600)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[color:var(--foreground)] font-medium">
                        Email
                      </div>
                      <div className="text-[color:var(--color-neutral-700)] group-hover:text-[color:var(--color-primary-700)]">
                        hello@octavenepal.com
                      </div>
                    </div>
                  </a>

                  <a
                    href="tel:+9779800000000"
                    className="group flex items-center gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-white/95 backdrop-blur px-3 py-3"
                  >
                    <div className="shrink-0 h-10 w-10 rounded-full ring-1 ring-black/5 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-[color:var(--color-primary-600)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[color:var(--foreground)] font-medium">
                        Phone
                      </div>
                      <div className="text-[color:var(--color-neutral-700)] group-hover:text-[color:var(--color-primary-700)]">
                        +977 980-0000000
                      </div>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-white/95 backdrop-blur px-3 py-3">
                    <div className="shrink-0 h-10 w-10 rounded-full ring-1 ring-black/5 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-[color:var(--color-primary-600)]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[color:var(--foreground)] font-medium">
                        Address
                      </div>
                      <div className="text-[color:var(--color-neutral-700)]">
                        Kathmandu, Nepal
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.06),transparent_65%)]" />
              <CardContent className="relative py-5">
                <h2
                  className="text-base md:text-lg font-semibold mb-2 text-[color:var(--foreground)]"
                  style={{ fontFamily: "var(--font-heading-sans)" }}
                >
                  Support hours
                </h2>
                <div className="group mt-3 text-sm flex items-center gap-3 rounded-lg border border-[color:var(--color-neutral-200)] bg-white/95 backdrop-blur px-3 py-3">
                  <div className="shrink-0 h-10 w-10 rounded-full ring-1 ring-black/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[color:var(--color-primary-600)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[color:var(--foreground)] font-medium">
                      Sunday - Friday
                    </div>
                    <div className="text-[color:var(--color-neutral-700)]">
                      10:00 AM - 6:00 PM (NPT)
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs md:text-sm text-[color:var(--color-primary-700)]">
                  Typical response time: within 2 hours{" "}
                  <span className="text-[color:var(--color-primary-400)]">
                    •
                  </span>{" "}
                  Closed on Saturday and public holidays
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
