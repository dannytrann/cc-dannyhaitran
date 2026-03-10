"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button3D } from "@/components/ui/Button3D";
import Link from "next/link";

export function ContactCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading className="flex flex-col items-center">
            Let&apos;s Work Together
          </SectionHeading>

          <p className="mx-auto mb-10 max-w-md text-text-muted">
            Have a project in mind? I&apos;d love to hear about it. Let&apos;s
            create something great together.
          </p>

          <Link href="/contact">
            <Button3D variant="primary" size="lg">
              Get in Touch
            </Button3D>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
