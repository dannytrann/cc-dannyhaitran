"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Button3D } from "@/components/ui/Button3D";
import { SpecialText } from "@/components/ui/special-text";
import Link from "next/link";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="h-full w-full bg-gradient-to-br from-lavender/10 to-rose/10" />
          }
        >
          <HeroScene />
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6" style={{ paddingBlock: "10vw" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="mb-4 text-sm font-medium tracking-widest text-accent uppercase">
            Realtor & Web Developer
          </p>

          <h1
            className="mb-6 font-heading italic text-text"
            style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)" }}
          >
            Hi, I&apos;m{" "}
            <SpecialText className="text-accent">Danny</SpecialText>
          </h1>

          <p className="mb-10 max-w-xl text-lg text-text-muted" style={{ lineHeight: 1.7 }}>
            Realtor in Campbell River, BC and web developer for local businesses
            on Vancouver Island. Husband, father of two, and lover of the great
            outdoors.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/projects">
              <Button3D variant="primary" size="lg">
                View My Work
              </Button3D>
            </Link>
            <Link href="/contact">
              <Button3D variant="outline" size="lg">
                Get in Touch
              </Button3D>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <div
        className="absolute top-1/4 right-[10%] z-0 h-16 w-16 rounded-full bg-rose/30"
        style={{ animation: "float 6s ease-in-out infinite" }}
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 right-[20%] z-0 h-10 w-10 rounded-full bg-lavender/30"
        style={{ animation: "float 6s ease-in-out infinite 2s" }}
        aria-hidden
      />
    </section>
  );
}
