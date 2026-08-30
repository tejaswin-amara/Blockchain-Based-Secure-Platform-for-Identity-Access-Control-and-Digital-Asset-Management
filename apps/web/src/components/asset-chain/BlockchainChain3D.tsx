'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Line, Environment, Grid, Sparkles, Float, Text } from '@react-three/drei';
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

const BLOCK_SPACING = 4.2;

// Conduit Pulse Particle flowing between blocks
function ConduitPulse({ startX, endX, color }: { startX: number; endX: number; color: string }) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulseRef.current) return;
    const t = (state.clock.elapsedTime * 0.8) % 1;
    pulseRef.current.position.x = startX + (endX - startX) * t;
    const pulseScale = Math.sin(t * Math.PI) * 0.12 + 0.08;
    pulseRef.current.scale.set(pulseScale, pulseScale, pulseScale);
  });

  return (
    <mesh ref={pulseRef} position={[startX, 0, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </mesh>
  );
}

// Cinematic Camera Choreographer
function CameraChoreographer({
  mode,
  isDetailMode,
  chainLength,
  selectedIndex,
}: {
  mode: 'chain' | 'centerpiece';
  isDetailMode: boolean;
  chainLength: number;
  selectedIndex: number | null;
}) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5.8));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    if (mode === 'centerpiece') {
      if (isDetailMode) {
        // Cinematic Push-In: Camera pushes intimately toward the block at slight architectural 3/4 angle
        targetPos.current.set(-0.6, 0.15, 5.0);
        targetLookAt.current.set(0.3, 0, 0);
      } else {
        // Spatial Overview: Elevated cinematic distance, beautifully framing block + grid + particles
        targetPos.current.set(0, 0.25, 8.4);
        targetLookAt.current.set(0, 0, 0);
      }
    } else {
      // Horizontal Multi-Block Sequence Tracking
      const focusX =
        selectedIndex !== null
          ? selectedIndex * BLOCK_SPACING
          : chainLength > 0
          ? (chainLength - 1) * BLOCK_SPACING
          : 0;

      targetPos.current.set(focusX, 0.3, 7.8);
      targetLookAt.current.set(focusX, 0, 0);
    }

    // Smooth cubic interpolation
    camera.position.lerp(targetPos.current, 0.06);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// Floating 3D Spatial Metadata Annotation (Appears beside block in Detail Mode)
function SpatialMetadataAnnotation({ block }: { block: AssetBlock }) {
  return (
    <group position={[2.4, 0, 0]}>
      {/* Background Glass Plate */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[2.5, 3.6]} />
        <meshBasicMaterial color="#020408" transparent opacity={0.7} />
      </mesh>
      <Line
        points={[
          [-1.25, 1.8, 0],
          [1.25, 1.8, 0],
          [1.25, -1.8, 0],
          [-1.25, -1.8, 0],
          [-1.25, 1.8, 0],
        ]}
        color="#38bdf8"
        lineWidth={1}
        transparent
        opacity={0.35}
      />

      <group position={[-1.05, 1.4, 0]}>
        <Text fontSize={0.11} color="#38bdf8" anchorX="left" letterSpacing={0.1}>
          INTERNAL LEDGER AUDIT
        </Text>
      </group>

      <group position={[-1.05, 0.95, 0]}>
        <Text fontSize={0.09} color="#64748b" anchorX="left">
          PARENT HASH (LINKAGE)
        </Text>
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.1}
          color="#e2e8f0"
          anchorX="left"
          maxWidth={2.1}
          lineHeight={1.3}
        >
          {block.previousHash.length > 20
            ? `${block.previousHash.substring(0, 16)}...`
            : block.previousHash}
        </Text>
      </group>

      <group position={[-1.05, 0.35, 0]}>
        <Text fontSize={0.09} color="#64748b" anchorX="left">
          SIGNATURE ALGORITHM
        </Text>
        <Text position={[0, -0.15, 0]} fontSize={0.12} color="#10b981" anchorX="left">
          ECDSA secp256k1 + SHA256
        </Text>
      </group>

      <group position={[-1.05, -0.2, 0]}>
        <Text fontSize={0.09} color="#64748b" anchorX="left">
          TIMESTAMP CONFIRMATION
        </Text>
        <Text position={[0, -0.15, 0]} fontSize={0.1} color="#cbd5e1" anchorX="left">
          {new Date(block.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Text>
      </group>

      <group position={[-1.05, -0.75, 0]}>
        <Text fontSize={0.09} color="#64748b" anchorX="left">
          NETWORK VALIDITY
        </Text>
        <Text position={[0, -0.15, 0]} fontSize={0.12} color="#38bdf8" anchorX="left">
          100% On-Chain Fidelity
        </Text>
      </group>

      <group position={[-1.05, -1.3, 0]}>
        <Text fontSize={0.09} color="#64748b" anchorX="left">
          DISCOVERY STATUS
        </Text>
        <Text position={[0, -0.15, 0]} fontSize={0.11} color="#d08a5d" anchorX="left">
          Core Decoupled & Inspectable
        </Text>
      </group>
    </group>
  );
}

export function BlockchainChain3D({
  chain,
  selectedBlock,
  onSelectBlock,
  mode = 'chain',
  centerpieceBlock,
  isDetailMode = false,
  height = '100%',
}: BlockchainChain3DProps) {
  const selectedIndex = selectedBlock ? chain.findIndex((b) => b.id === selectedBlock.id) : null;
  const activeBlock = centerpieceBlock || (chain.length > 0 ? chain[chain.length - 1] : null);

  return (
    <div style={{ width: '100%', height, minHeight: '420px', position: 'relative' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 5.8], fov: 46 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#030508']} />
        <fog attach="fog" args={['#030508', 6, 26]} />

        {/* Ambient & Atmospheric Lighting */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 10, 8]} intensity={1.5} />
        <pointLight position={[-6, -3, -2]} intensity={0.6} color="#06b6d4" />
        <pointLight position={[6, 3, 3]} intensity={0.7} color="#d08a5d" />

        <Environment preset="night" />

        {/* Perspective Spatial Grid Floor */}
        <Grid
          infiniteGrid
          fadeDistance={24}
          sectionColor="#06b6d4"
          cellColor="#080e1a"
          position={[0, -2.5, 0]}
          cellThickness={0.5}
          sectionThickness={1.2}
          cellSize={1}
          sectionSize={4}
        />

        {/* Drifting Cyber Particles */}
        <Sparkles count={140} scale={26} size={2.4} speed={0.4} opacity={0.3} color="#38bdf8" />

        {mode === 'centerpiece' ? (
          /* Centerpiece Focal Block with Cinematic Detail Reveal */
          <group>
            {activeBlock && (
              <Float
                speed={isDetailMode ? 0.5 : 2}
                rotationIntensity={isDetailMode ? 0.05 : 0.2}
                floatIntensity={isDetailMode ? 0.1 : 0.35}
              >
                <Block3D
                  block={activeBlock}
                  position={[isDetailMode ? -0.9 : 0, 0, 0]}
                  onSelect={onSelectBlock}
                  isSelected={selectedBlock?.id === activeBlock.id}
                  isCenterpiece={true}
                  isDetailMode={isDetailMode}
                />
              </Float>
            )}

            {/* Spatial Metadata Floater in Detail Mode */}
            {isDetailMode && activeBlock && (
              <SpatialMetadataAnnotation block={activeBlock} />
            )}
          </group>
        ) : (
          /* Connected Multi-Block Horizontal Spatial Sequence */
          <group>
            {chain.map((block, index) => {
              const posX = index * BLOCK_SPACING;
              const isSelected = selectedBlock?.id === block.id;
              const prevPosX = (index - 1) * BLOCK_SPACING;

              return (
                <React.Fragment key={block.id}>
                  <Block3D
                    block={block}
                    position={[posX, 0, 0]}
                    onSelect={onSelectBlock}
                    isSelected={isSelected}
                  />

                  {/* Inter-Block Glowing Energy Conduits */}
                  {index > 0 && (
                    <group>
                      <Line
                        points={[
                          [prevPosX + 1.4, 0, 0],
                          [posX - 1.4, 0, 0],
                        ]}
                        color="#d08a5d"
                        lineWidth={3}
                      />
                      <Line
                        points={[
                          [prevPosX + 1.4, -0.12, 0],
                          [posX - 1.4, -0.12, 0],
                        ]}
                        color="#06b6d4"
                        lineWidth={1.5}
                        transparent
                        opacity={0.65}
                      />
                      <ConduitPulse
                        startX={prevPosX + 1.4}
                        endX={posX - 1.4}
                        color="#38bdf8"
                      />
                    </group>
                  )}
                </React.Fragment>
              );
            })}
          </group>
        )}

        <OrbitControls
          enablePan={mode === 'chain'}
          enableZoom={true}
          enableRotate={!isDetailMode}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
          minDistance={2.5}
          maxDistance={16}
        />

        <CameraChoreographer
          mode={mode}
          isDetailMode={isDetailMode}
          chainLength={chain.length}
          selectedIndex={selectedIndex !== -1 ? selectedIndex : null}
        />
      </Canvas>
    </div>
  );
}
