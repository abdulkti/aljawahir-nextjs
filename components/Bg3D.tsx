'use client'
import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

function Logo3D() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture('/logo.png')

  return (
    <mesh ref={meshRef} scale={[2.5, 1.92, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.2}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += (pointer.x * 0.04 - groupRef.current.rotation.y) * 0.02
    groupRef.current.rotation.x += (-pointer.y * 0.03 - groupRef.current.rotation.x) * 0.02
  })

  return (
    <group ref={groupRef}>
      <Logo3D />
    </group>
  )
}

export default function Bg3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
