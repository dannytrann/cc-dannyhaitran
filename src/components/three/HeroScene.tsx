"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function HeroScene() {
  const prefersReduced = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ position: "absolute", inset: 0 }}
      frameloop={prefersReduced ? "never" : "always"}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
    >
      <ParticleField count={800} />
    </Canvas>
  );
}
