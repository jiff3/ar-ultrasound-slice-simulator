import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export function CameraRig() {
  const width = useThree((state) => state.size.width)
  const isNarrow = width < 560
  const cameraPosition: [number, number, number] = isNarrow ? [6.4, 4.8, 8.4] : [5.2, 4.2, 6.2]

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={isNarrow ? 52 : 44}
        near={0.1}
        far={100}
      />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={[0, 0.4, 0]}
        minDistance={3}
        maxDistance={14}
        maxPolarAngle={Math.PI * 0.48}
      />
    </>
  )
}
