"use client";

import { useState, type FormEvent } from "react";
import { FORM_WEBHOOK_URL } from "../lib/site";

type Status = "idle" | "sending" | "sent" | "error";

const STATUS_MESSAGES: Record<Exclude<Status, "idle" | "sending">, string> = {
  sent: "Request sent! We'll be in touch within 24 hours.",
  error: "There was an error. Please try again or call us directly.",
};

const inputClass =
  "w-full border-0 border-b border-line bg-transparent py-4 text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none transition-colors";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot check — if filled, it's a bot; pretend success
    if (typeof data.website_url === "string" && data.website_url.length > 0) {
      setStatus("sent");
      form.reset();
      return;
    }
    delete data.website_url;

    setStatus("sending");
    try {
      const response = await fetch(FORM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot field - spam protection */}
      <input
        type="text"
        name="website_url"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] -top-[9999px]"
      />
      <input type="text" name="name" placeholder="Your Name" required className={inputClass} />
      <input type="text" name="company" placeholder="Company (Optional)" className={`${inputClass} mt-5`} />
      <input type="email" name="email" placeholder="Email Address" required className={`${inputClass} mt-5`} />
      <input type="tel" name="phone" placeholder="Phone Number" className={`${inputClass} mt-5`} />
      <select name="inquiry_type" className={`${inputClass} mt-5 cursor-pointer [&>option]:bg-card`}>
        <option value="Free Estimate">Free Estimate</option>
        <option value="General Inquiry">General Inquiry</option>
        <option value="Service Request">Service Request</option>
      </select>
      <textarea
        name="details"
        rows={4}
        placeholder="Tell us about your project..."
        className={`${inputClass} mt-5`}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-fill mt-7 w-full border-2 border-primary bg-primary px-8 py-4 font-heading text-sm font-bold uppercase tracking-[0.18em] text-white disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : "Submit Request"}
      </button>
      {(status === "sent" || status === "error") && (
        <p
          role="status"
          className={`mt-5 text-sm ${status === "sent" ? "text-accent" : "text-red-400"}`}
        >
          {STATUS_MESSAGES[status]}
        </p>
      )}
    </form>
  );
}
