"use client";

import React from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      // Simulate async subscribe; swap with real API later
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setEmail("");
    } catch (_) {
      setStatus("error");
    }
  }

  return (
    <div className="w-full">
      {status === "success" ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
            <path d="M20 7L9 18l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Subscribed! You’ll hear from us soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
            className="flex-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={status === "error" ? "Please enter a valid email" : undefined}
          />
          <Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Subscribing…" : "Subscribe"}</Button>
        </form>
      )}
    </div>
  );
}


