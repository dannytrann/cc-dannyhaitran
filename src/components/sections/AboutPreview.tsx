"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkHoverFill } from "@/components/ui/LinkHoverFill";

export function AboutPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="prose-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading>About</SectionHeading>

            <div className="space-y-6 text-text-muted" style={{ lineHeight: 1.8 }}>
              <p>
                I&apos;m a Realtor based in Campbell River, BC, and I also
                build websites for local businesses across Vancouver Island.
                I love helping small businesses get online with clean, modern
                sites that actually drive results.
              </p>
              <p>
                When I&apos;m not working, you&apos;ll find me outdoors with my
                family, fishing, hiking, or exploring everything the Island has
                to offer.
              </p>
            </div>

            <div className="mt-8">
              <LinkHoverFill href="/about" className="text-accent font-medium">
                More about me →
              </LinkHoverFill>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
