"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function WrapperPlane({
  position,
  rotation,
  delay,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() - delay;
    if (t > 0 && t < 2 && ref.current) {
      ref.current.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0, t / 2);
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}

function AnimatedCamera() {
  const camRef = useRef<THREE.PerspectiveCamera>(null!);

  useFrame((state) => {
    if (!camRef.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth zoom-out from 5 → 8 units
    camRef.current.position.set(5 + t * 0.5, 5 + t * 0.5, 5 + t * 0.5);
    camRef.current.lookAt(0, 0, 0);
  });

  return <perspectiveCamera ref={camRef} fov={50} near={0.1} far={100} position={[5, 5, 5]} />;
}

export default function GiftWrapperScene() {
  return (
    <div className="w-full max-w-lg h-[400px] mx-auto border rounded-xl shadow-lg">
      <Canvas>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} />
        <AnimatedCamera />
        <OrbitControls enableZoom={false} />

        <Box />
        <WrapperPlane position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} delay={0} />
        <WrapperPlane position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]} delay={0.5} />
        <WrapperPlane position={[1, 0, 0]} rotation={[0, 0, -Math.PI / 2]} delay={1} />
        <WrapperPlane position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]} delay={1.5} />
      </Canvas>
    </div>
  );
}
