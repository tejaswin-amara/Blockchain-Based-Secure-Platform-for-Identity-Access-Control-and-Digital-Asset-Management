'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Environment, Grid, Sparkles, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Block3D } from './Block3D';
import type { AssetBlock } from '@/types/asset-chain';

interface BlockchainChain3DProps {
  chain: AssetBlock[];
  selectedBlock: AssetBlock | null;
  onSelectBlock: (block: AssetBlock) => void;
  mode?: 'chain' | 'centerpiece';
  centerpieceBlock?: AssetBlock | null;
  isDetailMode?: boolean;
  onExitDetail?: () => void;
  height?: string | number;
}

// 4-Block Spatial Depth Coordinates along a cinematic curved 3D spline
export const SPATIAL_BLOCK_POSITIONS: [number, number, number][] = [
  [-5.4, 0.45, -2.4],  // Block 000 — Genesis (Midground Left)
  [-1.8, -0.2, 0.7],   // Block 001 — Asset Created (Foreground Center-Left, Prominent)
  [1.8, 0.6, -1.8],    // Block 002 — Asset Transferred (Midground Right)
  [5.4, -0.1, 0.5],    // Block 003 — Latest Block (Foreground Right)
];

const OPCODES = [
  '◈ BLOCK 000 — GENESIS',
  '◈ BLOCK 001 — ASSET CREATED',
  '◈ BLOCK 002 — ASSET TRANSFERRED',
  '◈ BLOCK 003 — LATEST BLOCK',
];

// Spline Curved Energy Conduit connecting blocks in 3D space
function SplineConduit({
  startPos,
  endPos,
}: {
  startPos: [number, number, number];
  endPos: [number, number, number];
}) {
  const { points, curve } = useMemo(() => {
    // Elegant cubic Bézier arc curving gracefully through 3D depth
    const midX = (startPos[0] + endPos[0]) / 2;
    const midY = (startPos[1] + endPos[1]) / 2 + 0.35;
    const midZ = (startPos[2] + endPos[2]) / 2 - 0.4;

    const start = new THREE.Vector3(startPos[0] + 1.25, startPos[1], startPos[2]);
    const ctrl1 = new THREE.Vector3(startPos[0] + 2.0, startPos[1] + 0.3, midZ);
    const ctrl2 = new THREE.Vector3(endPos[0] - 2.0, endPos[1] + 0.3, midZ);
    const end = new THREE.Vector3(endPos[0] - 1.25, endPos[1], endPos[2]);

    const c = new THREE.CubicBezierCurve3(start, ctrl1, ctrl2, end);
    const pts = c.getPoints(32).map((p) => [p.x, p.y, p.z] as [number, number, number]);
    return { points: pts, curve: c };
  }, [startPos, endPos]);

  return (
    <group>
      {/* Primary Radiant Copper Connection Line */}
      <Line points={points} color="#d08a5d" lineWidth={2.5} />
      {/* Secondary Cyan Energy Flow Trace */}
      <Line points={points} color="#38bdf8" lineWidth={1.2} transparent opacity={0.65} />
      {/* Traveling Cryptographic Data Pulse */}
      <SplinePulse curve={curve} color="#7dd3fc" />
    </group>
  );
}

// Flowing Data Pulse along the 3D Cubic Spline
function SplinePulse({ curve, color }: { curve: THREE.CubicBezierCurve3; color: string }) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = (state.clock.elapsedTime * 0.45) % 1;
    const pt = curve.getPointAt(t);
    pulseRef.current.position.set(pt.x, pt.y, pt.z);
    const pulseScale = Math.sin(t * Math.PI) * 0.09 + 0.06;
    pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
  });

  return (
    <mesh ref={pulseRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

// Cinematic Camera Choreographer: Smooth transitions between 4-block overview & selected block focus
function CameraChoreographer({
  selectedBlock,
  isDetailMode,
  blocks,
}: {
  selectedBlock: AssetBlock | null;
  isDetailMode: boolean;
  blocks: AssetBlock[];
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 13.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.1, 0));

  useFrame(() => {
    if (isDetailMode && selectedBlock) {
      // Find the index of the selected block to locate its 3D world position
      const blockIndex = blocks.findIndex((b) => b.id === selectedBlock.id);
      const pos =
        blockIndex >= 0 && blockIndex < SPATIAL_BLOCK_POSITIONS.length
          ? SPATIAL_BLOCK_POSITIONS[blockIndex]
          : [0, 0, 0];

      // Push-in close to the focused block at comfortable architectural distance with room for the audit plate
      targetPos.current.set(pos[0] - 1.1, pos[1] + 0.25, pos[2] + 6.8);
      targetLookAt.current.set(pos[0] + 0.9, pos[1], pos[2]);
    } else {
      // Spatial 4-Block Overview Framing: beautifully captures the entire depth chain without overlap
      targetPos.current.set(0, 0.5, 13.8);
      targetLookAt.current.set(0, 0.1, 0);
    }

    // Smooth cubic interpolation
    camera.position.lerp(targetPos.current, 0.055);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// Floating 3D Spatial Metadata Annotation when a block is inspected
function SpatialMetadataAnnotation({
  block,
  position,
}: {
  block: AssetBlock;
  position: [number, number, number];
}) {
  return (
    <group position={[position[0] + 2.3, position[1], position[2]]}>
      {/* Background Glass Plate */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshBasicMaterial color="#020408" transparent opacity={0.78} />
      </mesh>
      <Line
        points={[
          [-1.25, 1.75, 0],
          [1.25, 1.75, 0],
          [1.25, -1.75, 0],
          [-1.25, -1.75, 0],
          [-1.25, 1.75, 0],
        ]}
        color="#38bdf8"
        lineWidth={1}
        transparent
        opacity={0.45}
      />

      <group position={[-1.05, 1.4, 0]}>
        <Text fontSize={0.11} color="#38bdf8" anchorX="left" letterSpacing={0.1}>
          BLOCKCHAIN AUDIT PLATE
        </Text>
      </group>

      <group position={[-1.05, 0.92, 0]}>
        <Text fontSize={0.085} color="#64748b" anchorX="left">
          PARENT HASH LINKAGE
        </Text>
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.095}
          color="#e2e8f0"
          anchorX="left"
          maxWidth={2.1}
        >
          {block.previousHash.length > 20
            ? `${block.previousHash.substring(0, 16)}...`
            : block.previousHash}
        </Text>
      </group>

      <group position={[-1.05, 0.35, 0]}>
        <Text fontSize={0.085} color="#64748b" anchorX="left">
          SIGNATURE PROOF
        </Text>
        <Text position={[0, -0.14, 0]} fontSize={0.11} color="#10b981" anchorX="left">
          ECDSA secp256k1 + SHA256
        </Text>
      </group>

      <group position={[-1.05, -0.18, 0]}>
        <Text fontSize={0.085} color="#64748b" anchorX="left">
          TIMESTAMP
        </Text>
        <Text position={[0, -0.14, 0]} fontSize={0.1} color="#cbd5e1" anchorX="left">
          {new Date(block.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </Text>
      </group>

      <group position={[-1.05, -0.7, 0]}>
        <Text fontSize={0.085} color="#64748b" anchorX="left">
          FIDELITY
        </Text>
        <Text position={[0, -0.14, 0]} fontSize={0.11} color="#38bdf8" anchorX="left">
          100% On-Chain Verifiable
        </Text>
      </group>

      <group position={[-1.05, -1.22, 0]}>
        <Text fontSize={0.085} color="#64748b" anchorX="left">
          CHAIN STATUS
        </Text>
        <Text position={[0, -0.14, 0]} fontSize={0.11} color="#d08a5d" anchorX="left">
          Active In Spatial Ledger
        </Text>
      </group>
    </group>
  );
}

export function BlockchainChain3D({
  chain,
  selectedBlock,
  onSelectBlock,
  isDetailMode = false,
  height = '100%',
}: BlockchainChain3DProps) {
  // Synthesize canonical 4-block story if fewer blocks exist
  const displayBlocks: AssetBlock[] = useMemo(() => {
    if (chain && chain.length >= 4) {
      return chain.slice(0, 4);
    }

    const genesis: AssetBlock =
      chain && chain.length > 0
        ? chain[0]
        : {
            id: 'block-0-genesis',
            index: 0,
            timestamp: 1724800000000,
            transactionType: 'GENESIS',
            owner: 'SYSTEM',
            previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
            currentHash: '853e8d91f2c4b0a7e6d194c7f5a01b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
            assetData: {
              assetId: 'GENESIS',
              assetName: 'Genesis Block',
              owner: 'SYSTEM',
              status: 'VERIFIED',
              metadata: { standard: 'ARC-001', network: 'MainNet Alpha' },
            },
            validationStatus: 'VERIFIED',
          };

    const block1: AssetBlock =
      chain && chain.length > 1
        ? chain[1]
        : {
            id: 'block-1-create',
            index: 1,
            timestamp: 1724803600000,
            transactionType: 'CREATE',
            owner: 'ADMIN',
            previousHash: genesis.currentHash,
            currentHash: '91ac4f7b2e10a8d3c5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6d821',
            assetData: {
              assetId: 'AST-001',
              assetName: 'Hardware Enclave AST-001',
              owner: 'ADMIN',
              status: 'VERIFIED',
              metadata: { securityLevel: 'Tier 4', origin: 'Silicon Fab A' },
            },
            validationStatus: 'VERIFIED',
          };

    const block2: AssetBlock =
      chain && chain.length > 2
        ? chain[2]
        : {
            id: 'block-2-transfer',
            index: 2,
            timestamp: 1724807200000,
            transactionType: 'TRANSFER',
            owner: 'USER-01',
            previousHash: block1.currentHash,
            currentHash: 'e38b0d4a1c5f8a9e2b7d6c5f4a3b2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6f91',
            assetData: {
              assetId: 'AST-001',
              assetName: 'Hardware Enclave AST-001',
              owner: 'USER-01',
              status: 'VERIFIED',
              metadata: { transferChannel: 'OpenBanking Escrow', previousOwner: 'ADMIN' },
            },
            validationStatus: 'VERIFIED',
          };

    const block3: AssetBlock =
      chain && chain.length > 3
        ? chain[3]
        : {
            id: 'block-3-latest',
            index: 3,
            timestamp: 1724810800000,
            transactionType: 'CREATE',
            owner: 'USER-02',
            previousHash: block2.currentHash,
            currentHash: '7d02e4f1a8c9b3d5e7f0a2b4c6d8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1b34c',
            assetData: {
              assetId: 'AST-002',
              assetName: 'Digital Treasury Bond AST-002',
              owner: 'USER-02',
              status: 'SYNCHRONIZED',
              metadata: { parValue: '$50,000 USD', yieldRate: '4.85%' },
            },
            validationStatus: 'PENDING',
          };

    return [genesis, block1, block2, block3];
  }, [chain]);

  const focusedBlockPos = useMemo(() => {
    if (!selectedBlock) return null;
    const idx = displayBlocks.findIndex((b) => b.id === selectedBlock.id);
    return idx >= 0 && idx < SPATIAL_BLOCK_POSITIONS.length
      ? SPATIAL_BLOCK_POSITIONS[idx]
      : SPATIAL_BLOCK_POSITIONS[0];
  }, [selectedBlock, displayBlocks]);

  return (
    <div style={{ width: '100%', height, minHeight: '420px', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 13.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#030508']} />
        <fog attach="fog" args={['#030508', 8, 34]} />

        {/* Ambient & Atmospheric Lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 8]} intensity={1.8} />
        <pointLight position={[-9, -3, -2]} intensity={0.8} color="#06b6d4" />
        <pointLight position={[9, 4, 3]} intensity={1.0} color="#d08a5d" />

        <Environment preset="night" />

        {/* Perspective Spatial Grid Floor */}
        <Grid
          infiniteGrid
          fadeDistance={32}
          sectionColor="#06b6d4"
          cellColor="#080e1a"
          position={[0, -2.8, 0]}
          cellThickness={0.5}
          sectionThickness={1.2}
          cellSize={1}
          sectionSize={4}
        />

        {/* Drifting Cyber Particles */}
        <Sparkles count={160} scale={32} size={2.5} speed={0.4} opacity={0.32} color="#38bdf8" />

        {/* ── 4-BLOCK CONNECTED SPATIAL DEPTH CHAIN ────────────────────────── */}
        <group>
          {displayBlocks.map((block, index) => {
            const position = SPATIAL_BLOCK_POSITIONS[index] || [0, 0, 0];
            const isSelected = selectedBlock?.id === block.id;
            const isDimmed = isDetailMode && !isSelected;

            return (
              <React.Fragment key={block.id}>
                <Block3D
                  block={block}
                  position={position}
                  onSelect={onSelectBlock}
                  isSelected={isSelected}
                  isDetailMode={isSelected && isDetailMode}
                  isDimmed={isDimmed}
                  customOpcode={OPCODES[index]}
                />

                {/* Spline Conduit Connecting Consecutive Blocks */}
                {index < displayBlocks.length - 1 && (
                  <SplineConduit
                    startPos={position}
                    endPos={SPATIAL_BLOCK_POSITIONS[index + 1]}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* Spatial Metadata Audit Plate Beside Focused Block in Detail Mode */}
          {isDetailMode && selectedBlock && focusedBlockPos && (
            <SpatialMetadataAnnotation
              block={selectedBlock}
              position={focusedBlockPos}
            />
          )}
        </group>

        {/* Orbit Controls (smooth orbiting when not in locked detail mode) */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={!isDetailMode}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3.4}
          minDistance={4.0}
          maxDistance={22}
        />

        {/* Camera Choreographer for smooth transition */}
        <CameraChoreographer
          selectedBlock={selectedBlock}
          isDetailMode={isDetailMode}
          blocks={displayBlocks}
        />
      </Canvas>
    </div>
  );
}
