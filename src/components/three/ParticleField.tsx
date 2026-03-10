"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
}

export function ParticleField({ count = 800 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Colors from palette: lavender, rose, cream
  const colors = useMemo(() => {
    const palette = [
      new THREE.Color("#b8c1ec"),
      new THREE.Color("#eebbc3"),
      new THREE.Color("#fffffe"),
      new THREE.Color("#4fc08d"),
    ];
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame(({ pointer }) => {
    if (!meshRef.current) return;

    mouseRef.current.x += (pointer.x * 2 - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (pointer.y * 2 - mouseRef.current.y) * 0.02;

    const posArray = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = originalPositions[i3];
      const oy = originalPositions[i3 + 1];

      // Gentle float + mouse attractor
      posArray[i3] = ox + Math.sin(Date.now() * 0.0005 + i * 0.1) * 0.1 + mouseRef.current.x * 0.1;
      posArray[i3 + 1] = oy + Math.cos(Date.now() * 0.0003 + i * 0.1) * 0.1 + mouseRef.current.y * 0.1;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y += 0.0003;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
