"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkHoverFill } from "@/components/ui/LinkHoverFill";

export function AboutPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[3/4] w-full max-w-[320px] border-2 border-shadow shadow-brutal overflow-hidden">
              <Image
                src="/images/danny-casual.jpg"
                alt="Danny Tran, Campbell River web developer and Realtor"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
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
