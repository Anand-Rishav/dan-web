"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

function NetworkSynergyCenterpiece({ mousePosition, isLowEnd }: { mousePosition: { x: number; y: number }; isLowEnd: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const radius = 2.6;

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x += (mousePosition.y * 0.35 - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.z += (mousePosition.x * 0.25 - groupRef.current.rotation.z) * 0.04;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.2;
      ring1Ref.current.rotation.y += delta * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.25;
      ring2Ref.current.rotation.z += delta * 0.1;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= delta * 0.18;
      ring3Ref.current.rotation.x -= delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Cybernetic Sphere */}
      <mesh>
        <icosahedronGeometry args={[radius, isLowEnd ? 2 : 3]} />
        <meshBasicMaterial
          wireframe
          color="#00bcd4"
          transparent
          opacity={0.32}
        />
      </mesh>

      {/* Inner Radiant Core Sphere */}
      <mesh>
        <icosahedronGeometry args={[radius * 0.92, isLowEnd ? 1 : 2]} />
        <meshBasicMaterial
          wireframe
          color="#ab47bc"
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Deep Central Pulsing Core */}
      <mesh>
        <sphereGeometry args={[radius * 0.5, 16, 16]} />
        <meshBasicMaterial
          wireframe
          color="#006064"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Orbit Ring 1 - Creator Network Orbit */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[radius * 1.35, 0.015, 16, 64]} />
        <meshBasicMaterial color="#26c6da" transparent opacity={0.4} />
      </mesh>

      {/* Orbit Ring 2 - Brand Synergy Orbit */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[radius * 1.5, 0.012, 16, 64]} />
        <meshBasicMaterial color="#ba68c8" transparent opacity={0.35} />
      </mesh>

      {/* Orbit Ring 3 - Viral Velocity Ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[radius * 1.65, 0.01, 16, 64]} />
        <meshBasicMaterial color="#80deea" transparent opacity={0.25} />
      </mesh>

      {/* Swarm Points representing creator nodes */}
      <points>
        <icosahedronGeometry args={[radius * 1.15, isLowEnd ? 2 : 4]} />
        <pointsMaterial
          color="#00bcd4"
          size={0.04}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      {/* Violet Nodes */}
      <points>
        <icosahedronGeometry args={[radius * 1.4, 2]} />
        <pointsMaterial
          color="#ce93d8"
          size={0.05}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function ClientHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // This component is loaded via next/dynamic with { ssr: false }, so it only
  // ever renders on the client — isLowEnd can be computed lazily on first render.
  const [isLowEnd] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const hardwareConcurrency = navigator.hardwareConcurrency || 8;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return hardwareConcurrency < 2 && isMobile;
  });
  // False until the hero intersects the viewport; the WebGL canvas only
  // mounts while visible so no GPU work happens offscreen or in hidden tabs.
  const [isSceneActive, setIsSceneActive] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLowEnd) return;

    const host = hostRef.current;
    if (!host) return;

    const syncFromRect = () => {
      if (document.hidden) {
        setIsSceneActive(false);
        return;
      }
      const rect = host.getBoundingClientRect();
      setIsSceneActive(rect.bottom > 0 && rect.top < window.innerHeight);
    };

    const observer = new IntersectionObserver(
      ([entry]) => setIsSceneActive(entry.isIntersecting && !document.hidden),
      { threshold: 0 }
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", syncFromRect);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncFromRect);
    };
  }, [isLowEnd]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (isLowEnd) {
    return (
      <div className="absolute inset-0 bg-background overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-25">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full border border-primary-500/30"
            style={{ animation: "spin 24s linear infinite" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-secondary-500/25"
            style={{ animation: "spin 32s linear infinite reverse" }}
          />
        </div>
        <style>{`@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div ref={hostRef} className="absolute inset-0 pointer-events-none z-0">
      {isSceneActive && (
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 48 }}
          style={{ background: "transparent" }}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 6]} intensity={1.2} />
          <pointLight position={[-5, -5, -2]} color="#9c27b0" intensity={1} />
          <pointLight position={[5, 5, 2]} color="#00bcd4" intensity={1} />
          <NetworkSynergyCenterpiece mousePosition={mousePosition} isLowEnd={isLowEnd} />
        </Canvas>
      )}
    </div>
  );
}
