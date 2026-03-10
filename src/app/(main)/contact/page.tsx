"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button3D } from "@/components/ui/Button3D";
import { socialLinks } from "@/lib/constants";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // Simulate form submission
    setTimeout(() => setStatus("sent"), 1000);
  }

  return (
    <Container>
      <div className="grid gap-16 lg:grid-cols-2">
        {/* Form */}
        <div>
          <SectionHeading subtitle="I'd love to hear from you">
            Get in Touch
          </SectionHeading>

          {status === "sent" ? (
            <div className="border-2 border-shadow bg-accent/10 p-8 shadow-brutal-sm">
              <h3 className="mb-2 font-heading text-xl italic text-accent">
                Message Sent!
              </h3>
              <p className="text-text-muted">
                Thanks for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full border-2 border-shadow bg-surface px-4 py-3 text-text outline-none transition-shadow focus:shadow-brutal-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border-2 border-shadow bg-surface px-4 py-3 text-text outline-none transition-shadow focus:shadow-brutal-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-text"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full resize-y border-2 border-shadow bg-surface px-4 py-3 text-text outline-none transition-shadow focus:shadow-brutal-sm"
                />
              </div>

              <Button3D
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </Button3D>
            </form>
          )}
        </div>

        {/* Social links */}
        <div>
          <h2 className="mb-8 font-heading text-2xl italic text-text">
            Find Me Online
          </h2>

          <div className="space-y-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover-fill block border-2 border-shadow bg-surface p-4 shadow-brutal-sm transition-all hover:-translate-y-0.5 hover:shadow-brutal"
              >
                <span className="font-medium text-text">{link.name}</span>
                <span className="ml-2 text-sm text-text-muted">→</span>
              </a>
            ))}
          </div>

          <div className="mt-12 border-2 border-shadow bg-lavender/10 p-6 shadow-brutal-sm">
            <h3 className="mb-2 font-heading text-lg italic text-text">
              Prefer email?
            </h3>
            <p className="mb-2 text-sm text-text-muted">
              General:{" "}
              <a href="mailto:dannyhaitran@outlook.com" className="link-hover-fill text-accent">
                dannyhaitran@outlook.com
              </a>
            </p>
            <p className="text-sm text-text-muted">
              Real estate:{" "}
              <a href="mailto:dannytran@royallepage.ca" className="link-hover-fill text-accent">
                dannytran@royallepage.ca
              </a>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
