import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const CREAM = '#f2f0e8'
const ACCENT = '#d9ff43'
const PALE = '#c8cbbc'

/** Poussière en suspension, dérive lente sur trois axes. */
function Dust({ count = 220 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.012
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.3
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CREAM}
        size={0.018}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** Halo diffus — grande sphère émissive très transparente, façon lumière de fond. */
function Glow({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
}) {
  const mesh = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime * speed
    mesh.current.position.x = position[0] + Math.sin(t) * 0.6
    mesh.current.position.y = position[1] + Math.cos(t * 0.8) * 0.4
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color={color} transparent opacity={0.05} depthWrite={false} />
    </mesh>
  )
}

/**
 * Champ d'ambiance 3D — chargé séparément (voir AmbientLayer), posé derrière
 * une section pour lui donner de la profondeur. Aucune géométrie complexe :
 * un nuage de points et deux halos, tout en transparent additif léger.
 */
export default function BackgroundField() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 40 }}
      gl={{ alpha: true, antialias: false }}
      style={{ pointerEvents: 'none' }}
    >
      <Dust />
      <Glow position={[-3, 1, -2]} color={ACCENT} scale={2.2} speed={0.12} />
      <Glow position={[3.2, -0.8, -3]} color={PALE} scale={2.8} speed={0.08} />
    </Canvas>
  )
}
