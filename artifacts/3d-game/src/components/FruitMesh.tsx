import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Fruit, FRUIT_CONFIG } from '../game/types';

interface FruitMeshProps {
  fruit: Fruit;
  onSlice: (id: string) => void;
}

export function FruitMesh({ fruit, onSlice }: FruitMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const cfg = FRUIT_CONFIG[fruit.type];

  const geometry = useMemo(() => {
    if (fruit.type === 'pineapple') {
      return new THREE.CylinderGeometry(0.2, 0.3, 0.8, 12);
    }
    if (fruit.type === 'watermelon') {
      return new THREE.SphereGeometry(cfg.radius, 16, 16);
    }
    return new THREE.SphereGeometry(cfg.radius, 14, 14);
  }, [fruit.type, cfg.radius]);

  const glowGeometry = useMemo(() => {
    return new THREE.SphereGeometry(cfg.radius * 1.35, 10, 10);
  }, [cfg.radius]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.set(fruit.x, fruit.y, fruit.z);
    meshRef.current.rotation.z = fruit.rotation;
    meshRef.current.rotation.x = fruit.rotation * 0.5;

    if (glowRef.current) {
      glowRef.current.position.set(fruit.x, fruit.y, fruit.z);
      const pulse = 0.85 + 0.15 * Math.sin(Date.now() * 0.004);
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handleClick = () => {
    if (!fruit.sliced && !fruit.missed) {
      onSlice(fruit.id);
    }
  };

  const isSpecial = ['frost_pear', 'volcanic_plum', 'gravity_core'].includes(fruit.type);

  return (
    <group>
      {isSpecial && (
        <mesh ref={glowRef} onClick={handleClick}>
          <primitive object={glowGeometry} />
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.emissive}
            emissiveIntensity={2}
            transparent
            opacity={0.25}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'crosshair';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <primitive object={geometry} />
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={isSpecial ? 1.2 : 0.4}
          roughness={0.3}
          metalness={fruit.type === 'gravity_core' ? 0.9 : 0.1}
        />
      </mesh>
    </group>
  );
}
