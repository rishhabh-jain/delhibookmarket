import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface BookProps {
  coverImageUrl?: string;
  rotationSpeed?: number;
}

export default function RotatingBook({ 
  coverImageUrl = 'https://img.freepik.com/free-vector/empty-book-realistic-mockup_1017-9207.jpg',
  rotationSpeed = 0.5 
}: BookProps) {
  const bookGroupRef = useRef<THREE.Group>(null);

  // ✅ Always load texture at the top level
  // let coverTexture: THREE.Texture | null = null;
  try {
    // coverTexture = useLoader(TextureLoader, coverImageUrl);
    // coverTexture.wrapS = THREE.ClampToEdgeWrapping;
    // coverTexture.wrapT = THREE.ClampToEdgeWrapping;
    // coverTexture.minFilter = THREE.LinearFilter;
    // coverTexture.magFilter = THREE.LinearFilter;
  } catch {
    console.warn('❌ Failed to load book cover, using fallback texture');
  }

  // ✅ Fallback texture generator
  const createTextTexture = (text: string, fontSize = 48, color = '#FFD700') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 512;

    // Background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 50);

    ctx.font = `${fontSize * 0.6}px Arial`;
    ctx.fillText('Custom Cover', canvas.width / 2, canvas.height / 2 + 30);

    return new THREE.CanvasTexture(canvas);
  };

  const fallbackTexture = createTextTexture('BOOK');

  // ✅ Animation loop
  useFrame((state) => {
    if (!bookGroupRef.current) return;
    const t = state.clock.elapsedTime;

    bookGroupRef.current.rotation.y = t * rotationSpeed; // spin
    bookGroupRef.current.position.y = Math.sin(t * 0.8) * 0.1; // float
    bookGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05; // wobble
    bookGroupRef.current.rotation.z = Math.cos(t * 0.4) * 0.02; // wobble
  });

  // Book dims
  const bookWidth = 3;
  const bookHeight = 4;
  const bookDepth = 0.4;
  const coverThickness = 0.05;

  return (
    <group ref={bookGroupRef}>
      {/* Front Cover */}
      <mesh position={[0, 0, bookDepth / 2 + coverThickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
        <meshPhongMaterial 
          // map={coverTexture ?? fallbackTexture} 
          shininess={20}
          specular={new THREE.Color(0x111111)}
        />
      </mesh>

      {/* Back Cover */}
      <mesh position={[0, 0, -bookDepth / 2 - coverThickness / 2]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
        <meshPhongMaterial color="#2a2a2a" shininess={30} />
      </mesh>

      {/* Pages */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[bookWidth - 0.1, bookHeight - 0.1, bookDepth]} />
        <meshLambertMaterial color="#f8f8f0" transparent opacity={0.95} />
      </mesh>

      {/* Spine */}
      <mesh position={[-bookWidth / 2 - coverThickness / 2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[coverThickness, bookHeight, bookDepth + coverThickness * 2]} />
        <meshPhongMaterial color="#1a1a1a" shininess={40} />
      </mesh>
    </group>
  );
}
