import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

const SAGE = '#9caf88'
const RED = '#d64545'

// Pull the camera back on narrow (portrait) containers so nothing gets cropped
function ResponsiveCamera() {
  const { camera, size } = useThree()
  const aspect = size.width / size.height
  camera.position.z = aspect < 1.2 ? 5.6 + (1.2 - aspect) * 2.2 : 5.6
  camera.updateProjectionMatrix()
  return null
}

function Blob() {
  const group = useRef()

  // Tilt the whole group toward the pointer (mouse on desktop, touch on mobile)
  useFrame((state) => {
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.6, 0.06)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.4, 0.06)
  })

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
        {/* Main sage blob */}
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial
            color={SAGE}
            distort={0.42}
            speed={1.8}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>

        {/* Red ring orbiting the blob */}
        <mesh rotation={[Math.PI / 2.4, 0.3, 0]} scale={2.15}>
          <torusGeometry args={[1, 0.018, 16, 120]} />
          <meshStandardMaterial color={RED} roughness={0.4} />
        </mesh>
      </Float>

      {/* Small red satellite */}
      <Float speed={2.4} floatIntensity={2}>
        <mesh position={[1.9, 1.3, 0.4]}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color={RED} roughness={0.3} />
        </mesh>
      </Float>
    </group>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#fff3e6" />
      <ResponsiveCamera />
      <Blob />
    </Canvas>
  )
}
