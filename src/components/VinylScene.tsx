import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CREAM = '#f2f0e8'
const PALE = '#c8cbbc'
const NAVY_ALT = '#1a1c17'
const NAVY = '#0c0d0b'
const ACCENT = '#d9ff43'

/** Disque vinyle : plateau mat, sillons concentriques, étiquette centrale. */
function Vinyl() {
  const group = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const baseTilt = -0.32

  const grooves = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => 0.62 + i * ((1.42 - 0.62) / 10)).map((radius, i) => ({
        radius,
        key: i,
      })),
    []
  )

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    g.rotation.z += delta * 0.4
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, baseTilt + pointer.y * 0.12, 0.04)
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.x * 0.22, 0.04)
    g.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.08
  })

  return (
    <group ref={group} rotation={[baseTilt, 0, 0]}>
      {/* Plateau */}
      <mesh receiveShadow>
        <cylinderGeometry args={[1.55, 1.55, 0.045, 96]} />
        <meshStandardMaterial color={NAVY_ALT} roughness={0.55} metalness={0.25} />
      </mesh>

      {/* Sillons — fins anneaux légèrement en relief */}
      {grooves.map(({ radius, key }) => (
        <mesh key={key} position={[0, 0.024, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.006, 96]} />
          <meshBasicMaterial color={PALE} transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Étiquette */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.56, 64]} />
        <meshStandardMaterial color={ACCENT} roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Trou de spindle */}
      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial color={NAVY} />
      </mesh>
    </group>
  )
}

/** Poussière en suspension — dérive lente, façon lumière filtrée en altitude. */
function Dust() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 140
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.elapsedTime * 0.015
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={CREAM}
        size={0.02}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/**
 * Scène 3D — chargée séparément du bundle principal (voir VinylSection).
 * DPR plafonné et scène minimale : un disque, quelques lumières, un nuage de
 * points. Pas de post-processing, pas de modèle externe à charger.
 */
export default function VinylScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.3, 4.4], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} color={PALE} />
      <pointLight position={[2.4, 1.8, 2.6]} intensity={22} color={ACCENT} />
      <pointLight position={[-2.2, -1, 2]} intensity={10} color={CREAM} />
      <Vinyl />
      <Dust />
    </Canvas>
  )
}
