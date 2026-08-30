'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Edges, Ring } from '@react-three/drei';
import * as THREE from 'three';
import type { AssetBlock } from '@/types/asset-chain';

interface Block3DProps {
  block: AssetBlock;
  position: [number, number, number];
  onSelect: (block: AssetBlock) => void;
  isSelected?: boolean;
  isCenterpiece?: boolean;
  isDetailMode?: boolean;
}

export function Block3D({
  block,
  position,
  onSelect,
  isSelected = false,
  isCenterpiece = false,
  isDetailMode = false,
}: Block3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const mouseCoords = useRef({ x: 0, y: 0 });

  // Palette per operation type with deep obsidian body and crisp electric accents
  const { baseColor, accentColor, glowColor } = useMemo(() => {
    if (block.index === 0) {
      return {
        baseColor: '#120b07', // Obsidian copper
        accentColor: '#d08a5d', // Radiant copper
        glowColor: '#b66a42',
      };
    }
    switch (block.transactionType) {
      case 'CREATE':
        return {
          baseColor: '#07140e', // Obsidian emerald
          accentColor: '#10b981', // Laser emerald
          glowColor: '#34d399',
        };
      case 'TRANSFER':
        return {
          baseColor: '#070e17', // Obsidian sapphire
          accentColor: '#38bdf8', // Cyber sky
          glowColor: '#60a5fa',
        };
      case 'SHARE':
        return {
          baseColor: '#0e0717', // Obsidian amethyst
          accentColor: '#c084fc', // Electric purple
          glowColor: '#a855f7',
        };
      default:
        return {
          baseColor: '#0a0d14',
          accentColor: '#38bdf8',
          glowColor: '#06b6d4',
        };
    }
  }, [block.index, block.transactionType]);

  // Frame animation: continuous rotation + cursor parallax + shell decoupling
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // In detail mode, lock into clear frontal-perspective inspection
    if (isDetailMode) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.08, 0.08);
    } else {
      // In overview mode, gentle architectural 3/4 orbital wander keeping holographic faces legible
      const baseAngle = 0.32; // Architectural perspective revealing front face & physical bevel depth
      const wander = Math.sin(state.clock.elapsedTime * 0.5 + block.index) * 0.35;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseAngle + wander, 0.06);
    }

    // Dynamic levitation float
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.6 + block.index) * 0.08;
    groupRef.current.position.y = position[1] + floatOffset;

    // Cursor Parallax Reaction (pointer position mapped across screen)
    const targetRotX = mouseCoords.current.y * 0.35;
    const targetRotZ = -mouseCoords.current.x * 0.25;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.08);

    // Inner core harmonic respiration
    if (coreRef.current) {
      const corePulse = 1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.06;
      coreRef.current.scale.set(corePulse, corePulse, corePulse);
    }

    // Outer Chassis Decoupling / Shell Expansion in Detail Mode
    if (outerBoxRef.current) {
      const targetOuterScale = isDetailMode ? 1.15 : hovered ? 1.04 : 1.0;
      outerBoxRef.current.scale.lerp(
        new THREE.Vector3(targetOuterScale, targetOuterScale, targetOuterScale),
        0.1
      );
    }

    // Quantum orbital rings rotation
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
    }
  });

  const baseScale = 1.0;
  const overallScale = hovered || isSelected ? baseScale * 1.04 : baseScale;

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerMove = (e: any) => {
    e.stopPropagation();
    if (e.point && groupRef.current) {
      const boxPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(boxPos);
      mouseCoords.current = {
        x: Math.max(-1, Math.min(1, e.point.x - boxPos.x)),
        y: Math.max(-1, Math.min(1, e.point.y - boxPos.y)),
      };
    }
  };

  const handlePointerOut = (e: any) => {
    e.stopPropagation();
    setHovered(false);
    mouseCoords.current = { x: 0, y: 0 };
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(block);
  };

  const shortHash = block.currentHash
    ? `${block.currentHash.substring(0, 6)}...${block.currentHash.substring(block.currentHash.length - 4)}`
    : '0x0000...0000';

  const assetName =
    block.assetData?.assetName || (block.index === 0 ? 'GENESIS ORIGIN LEDGER' : 'TOKENIZED ASSET');
  const assetId = block.assetData?.assetId || 'GENESIS';

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[overallScale, overallScale, overallScale]}
      onPointerOver={handlePointerOver}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* ── LAYER 1: OUTER TRANSLUCENT OBSIDIAN CHASSIS ───────────────────── */}
      <RoundedBox
        ref={outerBoxRef as any}
        args={[2.7, 3.8, 1.15]}
        radius={0.16}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color={baseColor}
          metalness={0.8}
          roughness={0.18}
          clearcoat={0.9}
          clearcoatRoughness={0.15}
          transmission={0.25}
          thickness={1.1}
          transparent={true}
          opacity={0.88}
          emissive={new THREE.Color(accentColor)}
          emissiveIntensity={hovered || isSelected || isDetailMode ? 0.75 : 0.2}
        />
        {/* Neon Vector Edge Contours */}
        <Edges
          linewidth={2.5}
          threshold={14}
          color={accentColor}
          transparent
          opacity={hovered || isSelected || isDetailMode ? 1.0 : 0.45}
        />

        {/* ── LAYER 2: FRONT HOLOGRAPHIC DATA PROJECTION ──────────────────── */}
        <group position={[0, 0, 0.59]}>
          {/* Top Block Pill Badge */}
          <group position={[0, 1.45, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.9, 0.36]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.7} />
            </mesh>
            <Text
              fontSize={0.16}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
            >
              {block.index === 0 ? '◈ GENESIS BLOCK' : `◈ BLOCK #${block.index.toString().padStart(3, '0')}`}
            </Text>
          </group>

          {/* Asset Title */}
          <Text
            position={[0, 0.95, 0]}
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.4}
            textAlign="center"
          >
            {assetName}
          </Text>

          {/* Asset ID Tag */}
          <group position={[0, 0.52, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.5, 0.25]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.6} />
            </mesh>
            <Text
              fontSize={0.14}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
            >
              {`ASSET ID // ${assetId}`}
            </Text>
          </group>

          {/* Owner Entity Badge */}
          <group position={[0, 0.05, 0]}>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.1}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              RECORDED OWNER
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={0.19}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.3}
            >
              {block.owner || 'SYSTEM'}
            </Text>
          </group>

          {/* SHA-256 State Hash */}
          <group position={[0, -0.55, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.2, 0.32]} />
              <meshBasicMaterial color="#020408" transparent opacity={0.85} />
            </mesh>
            <Text
              position={[0, 0.06, 0]}
              fontSize={0.09}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              CRYPTOGRAPHIC STATE HASH
            </Text>
            <Text
              position={[0, -0.07, 0]}
              fontSize={0.14}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.06}
            >
              {shortHash}
            </Text>
          </group>

          {/* Verification Status Pill */}
          <group position={[0, -1.35, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.8, 0.3]} />
              <meshBasicMaterial
                color={block.validationStatus === 'VERIFIED' ? '#064e3b' : '#7f1d1d'}
                transparent
                opacity={0.88}
              />
            </mesh>
            <Text
              fontSize={0.13}
              color={block.validationStatus === 'VERIFIED' ? '#6ee7b7' : '#fca5a5'}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.12}
            >
              {block.validationStatus === 'VERIFIED' ? '● VERIFIED ON-CHAIN' : '▲ PENDING AUDIT'}
            </Text>
          </group>
        </group>

        {/* ── LAYER 3: TECHNICAL BLUEPRINT ON BACK FACE ───────────────────── */}
        <group position={[0, 0, -0.59]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.15}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
          >
            IMMUTABLE PROVENANCE
          </Text>

          <Text
            position={[0, 0.45, 0]}
            fontSize={0.12}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={2.2}
            lineHeight={1.4}
          >
            {block.index === 0
              ? 'Root genesis state block initialized with verifiable zero-entropy anchor.'
              : `Block sequence #${block.index} confirming cryptographically audited state mutation.`}
          </Text>

          <group position={[0, -0.4, 0]}>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.1}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
            >
              OPCODE MUTATION
            </Text>
            <Text
              position={[0, -0.08, 0]}
              fontSize={0.18}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {block.transactionType}
            </Text>
          </group>

          <Text
            position={[0, -1.3, 0]}
            fontSize={0.1}
            color="#475569"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
          >
            CONFIRMED BY GOSSIP CONSENSUS
          </Text>
        </group>
      </RoundedBox>

      {/* ── LAYER 4: INTERNAL QUANTUM LUMINOUS ENERGY CORE ────────────────── */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2.8, 0.7]} />
        <meshBasicMaterial
          color={glowColor}
          transparent={true}
          opacity={isDetailMode ? 0.38 : hovered ? 0.25 : 0.12}
        />
      </mesh>

      {/* ── LAYER 5: ORBITAL QUANTUM RINGS (Appears in Detail Mode / Hover) ─ */}
      <group ref={ringRef} visible={hovered || isDetailMode}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.32, 64]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[2.5, 2.52, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
