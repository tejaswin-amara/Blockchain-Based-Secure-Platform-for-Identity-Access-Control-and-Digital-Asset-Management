'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';
import type { AssetBlock } from '@/types/asset-chain';

interface Block3DProps {
  block: AssetBlock;
  position: [number, number, number];
  onSelect: (block: AssetBlock) => void;
  isSelected?: boolean;
  isCenterpiece?: boolean;
  isDetailMode?: boolean;
  isDimmed?: boolean;
  customOpcode?: string;
}

export function Block3D({
  block,
  position,
  onSelect,
  isSelected = false,
  isCenterpiece = false,
  isDetailMode = false,
  isDimmed = false,
  customOpcode,
}: Block3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerBoxRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const mouseCoords = useRef({ x: 0, y: 0 });

  // Sleek deep obsidian-bronze material with signature radiant copper accents
  const { baseColor, accentColor, glowColor } = useMemo(() => {
    const copperAccent = '#d08a5d'; // Signature radiant copper edge
    const copperGlow = '#b66a42';

    if (block.index === 0) {
      return {
        baseColor: '#0a0806', // Obsidian bronze
        accentColor: copperAccent,
        glowColor: copperGlow,
      };
    }

    switch (block.transactionType) {
      case 'CREATE':
        return {
          baseColor: '#07080a',
          accentColor: '#d49463', // Warm golden copper
          glowColor: '#10b981', // Subtle internal emerald trace
        };
      case 'TRANSFER':
        return {
          baseColor: '#08080c',
          accentColor: '#c88655', // Rich bronze copper
          glowColor: '#38bdf8', // Subtle internal sapphire trace
        };
      case 'SHARE':
        return {
          baseColor: '#0a070a',
          accentColor: '#d08a5d',
          glowColor: '#c084fc',
        };
      default:
        return {
          baseColor: '#0a0806',
          accentColor: copperAccent,
          glowColor: copperGlow,
        };
    }
  }, [block.index, block.transactionType]);

  // Frame animation: oscillation + cursor parallax + shell decoupling
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isDetailMode) {
      // Orient smoothly forward when inspected
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.08, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.08);
    } else {
      // Architectural 3/4 perspective with gentle orbital wander
      const baseAngle = 0.28;
      const wander = Math.sin(state.clock.elapsedTime * 0.35 + block.index * 1.3) * 0.16;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        baseAngle + wander,
        0.05
      );

      // Cursor Parallax
      const targetRotX = mouseCoords.current.y * 0.2;
      const targetRotZ = -mouseCoords.current.x * 0.14;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.05);
    }

    // Dynamic levitation float
    const floatOffset = Math.sin(state.clock.elapsedTime * 1.2 + block.index * 1.4) * 0.06;
    groupRef.current.position.y = position[1] + (hovered ? floatOffset + 0.14 : floatOffset);

    // Inner core pulse
    if (coreRef.current) {
      const corePulse = 1 + Math.sin(state.clock.elapsedTime * 2.8 + block.index) * 0.04;
      coreRef.current.scale.set(corePulse, corePulse, corePulse);
    }

    // Outer Chassis Decoupling
    if (outerBoxRef.current) {
      const targetOuterScale = isDetailMode ? 1.08 : hovered ? 1.03 : 1.0;
      outerBoxRef.current.scale.lerp(
        new THREE.Vector3(targetOuterScale, targetOuterScale, targetOuterScale),
        0.08
      );
    }

    // Quantum orbital rings rotation
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
  });

  const baseScale = 1.0;
  const overallScale = (hovered || isSelected) ? baseScale * 1.03 : baseScale;

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
    : '853e8...c7f5';

  const assetName =
    block.assetData?.assetName || (block.index === 0 ? 'Genesis Block' : `Asset #${block.index}`);
  const assetId = block.assetData?.assetId || (block.index === 0 ? 'GENESIS' : `AST-00${block.index}`);

  const headerLabel = useMemo(() => {
    if (customOpcode) return customOpcode;
    if (block.index === 0) return '◈ GENESIS BLOCK';
    if (block.transactionType === 'CREATE') return `◈ BLOCK 00${block.index} — CREATED`;
    if (block.transactionType === 'TRANSFER') return `◈ BLOCK 00${block.index} — TRANSFERRED`;
    return `◈ BLOCK 00${block.index}`;
  }, [block.index, block.transactionType, customOpcode]);

  const opacityMultiplier = isDimmed ? 0.22 : 1.0;

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
      {/* ── LAYER 1: OUTER LUSTROUS BRONZE/COPPER CHASSIS ────────────────── */}
      <RoundedBox
        ref={outerBoxRef as any}
        args={[2.7, 3.8, 1.15]}
        radius={0.16}
        smoothness={6}
      >
        <meshPhysicalMaterial
          color={baseColor}
          metalness={0.9}
          roughness={0.16}
          clearcoat={0.96}
          clearcoatRoughness={0.12}
          reflectivity={0.92}
          transparent={true}
          opacity={isDimmed ? 0.22 : 0.94}
          emissive={new THREE.Color(hovered || isSelected || isDetailMode ? accentColor : '#000000')}
          emissiveIntensity={hovered || isSelected || isDetailMode ? 0.35 : 0}
        />
        {/* Radiant Vector Edge Contours */}
        <Edges
          linewidth={2.2}
          threshold={14}
          color={accentColor}
          transparent
          opacity={isDimmed ? 0.15 : hovered || isSelected || isDetailMode ? 1.0 : 0.6}
        />

        {/* ── LAYER 2: FRONT HOLOGRAPHIC DATA PROJECTION ──────────────────── */}
        <group position={[0, 0, 0.59]}>
          {/* Top Block Pill Badge */}
          <group position={[0, 1.48, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.3, 0.32]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.8 * opacityMultiplier} />
            </mesh>
            <Text
              fontSize={0.125}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.09}
              fillOpacity={opacityMultiplier}
            >
              {headerLabel}
            </Text>
          </group>

          {/* Asset Title */}
          <Text
            position={[0, 0.98, 0]}
            fontSize={0.19}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.3}
            textAlign="center"
            fillOpacity={opacityMultiplier}
          >
            {assetName}
          </Text>

          {/* Asset ID Tag */}
          <group position={[0, 0.54, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.7, 0.24]} />
              <meshBasicMaterial color="#000000" transparent opacity={0.7 * opacityMultiplier} />
            </mesh>
            <Text
              fontSize={0.12}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.08}
              fillOpacity={opacityMultiplier}
            >
              {`ASSET ID // ${assetId}`}
            </Text>
          </group>

          {/* Owner Entity Badge */}
          <group position={[0, 0.06, 0]}>
            <Text
              position={[0, 0.1, 0]}
              fontSize={0.085}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
              fillOpacity={opacityMultiplier}
            >
              RECORDED OWNER
            </Text>
            <Text
              position={[0, -0.1, 0]}
              fontSize={0.15}
              color="#f8fafc"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.3}
              fillOpacity={opacityMultiplier}
            >
              {block.owner || 'SYSTEM'}
            </Text>
          </group>

          {/* SHA-256 State Hash */}
          <group position={[0, -0.55, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.2, 0.3]} />
              <meshBasicMaterial color="#020408" transparent opacity={0.88 * opacityMultiplier} />
            </mesh>
            <Text
              position={[0, 0.055, 0]}
              fontSize={0.08}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
              fillOpacity={opacityMultiplier}
            >
              CRYPTOGRAPHIC STATE HASH
            </Text>
            <Text
              position={[0, -0.065, 0]}
              fontSize={0.115}
              color={accentColor}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.06}
              fillOpacity={opacityMultiplier}
            >
              {shortHash}
            </Text>
          </group>

          {/* Verification Status Pill */}
          <group position={[0, -1.35, 0]}>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[1.9, 0.28]} />
              <meshBasicMaterial
                color={block.validationStatus === 'VERIFIED' ? '#064e3b' : '#0369a1'}
                transparent
                opacity={0.88 * opacityMultiplier}
              />
            </mesh>
            <Text
              fontSize={0.11}
              color={block.validationStatus === 'VERIFIED' ? '#6ee7b7' : '#7dd3fc'}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.11}
              fillOpacity={opacityMultiplier}
            >
              {block.validationStatus === 'VERIFIED' ? '● VERIFIED ON-CHAIN' : '● SYNCHRONIZED'}
            </Text>
          </group>
        </group>

        {/* ── LAYER 3: TECHNICAL BLUEPRINT ON BACK FACE ───────────────────── */}
        <group position={[0, 0, -0.59]} rotation={[0, Math.PI, 0]}>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.13}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.14}
            fillOpacity={opacityMultiplier}
          >
            IMMUTABLE PROVENANCE
          </Text>

          <Text
            position={[0, 0.45, 0]}
            fontSize={0.105}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={2.2}
            lineHeight={1.4}
            fillOpacity={opacityMultiplier}
          >
            {block.index === 0
              ? 'Root genesis state block initialized with verifiable zero-entropy anchor.'
              : `Block sequence #${block.index} confirming cryptographically audited state mutation.`}
          </Text>

          <group position={[0, -0.4, 0]}>
            <Text
              position={[0, 0.09, 0]}
              fontSize={0.085}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              fillOpacity={opacityMultiplier}
            >
              OPCODE MUTATION
            </Text>
            <Text
              position={[0, -0.08, 0]}
              fontSize={0.16}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fillOpacity={opacityMultiplier}
            >
              {block.transactionType}
            </Text>
          </group>

          <Text
            position={[0, -1.3, 0]}
            fontSize={0.09}
            color="#475569"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
            fillOpacity={opacityMultiplier}
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
          opacity={isDimmed ? 0.04 : isDetailMode ? 0.32 : hovered ? 0.22 : 0.12}
        />
      </mesh>

      {/* ── LAYER 5: ORBITAL QUANTUM RINGS (Active in Detail Mode) ────────── */}
      <group ref={ringRef} visible={!isDimmed && (hovered || isDetailMode)}>
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
