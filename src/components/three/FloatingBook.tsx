import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingBookProps {
  onClick: () => void;
  isOpen: boolean;
}

const FloatingBook = ({ onClick, isOpen }: FloatingBookProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftCoverRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!isOpen) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (leftCoverRef.current) {
      const targetRotation = isOpen ? -Math.PI * 0.75 : 0;
      leftCoverRef.current.rotation.y += (targetRotation - leftCoverRef.current.rotation.y) * 0.05;
    }
  });

  const bookColor = '#1a0a2e';
  const accentColor = '#C8A2C8';

  return (
    <group ref={groupRef} onClick={onClick} scale={isOpen ? 0 : 1}>
      {/* Right cover (back) */}
      <RoundedBox args={[2, 2.6, 0.08]} radius={0.02} position={[0, 0, -0.1]}>
        <meshStandardMaterial color={bookColor} roughness={0.3} metalness={0.5} />
      </RoundedBox>

      {/* Pages */}
      <RoundedBox args={[1.9, 2.5, 0.15]} radius={0.01} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
      </RoundedBox>

      {/* Left cover (front - opens) */}
      <group ref={leftCoverRef} position={[-1, 0, 0.1]}>
        <RoundedBox args={[2, 2.6, 0.08]} radius={0.02} position={[1, 0, 0]}>
          <meshStandardMaterial color={bookColor} roughness={0.3} metalness={0.5} />
        </RoundedBox>
        {/* Title on cover */}
        <Text
          position={[1, 0.3, 0.06]}
          fontSize={0.18}
          color={accentColor}
          font="https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjYrEtFmSu5.woff2"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
        >
          The Book{'\n'}That Breathes
        </Text>
        {/* Decorative line */}
        <mesh position={[1, -0.15, 0.06]}>
          <planeGeometry args={[1.2, 0.003]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[1, -0.35, 0.06]}
          fontSize={0.08}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.4}
        >
          for Kasturi
        </Text>
      </group>

      {/* Glow */}
      <pointLight position={[0, 0, 1]} intensity={0.5} color={accentColor} distance={5} />
    </group>
  );
};

export default FloatingBook;
