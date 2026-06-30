import { Html } from '@react-three/drei'
import { DoubleSide } from 'three'
import { useSimulatorStore } from '../../app/store'
import { PROBE_FACE_OFFSET_CM } from '../../domain/coordinates'

export function SlicePoseHelpers() {
  const imagingDepth = useSimulatorStore((state) => state.imagingDepth)
  const imagingWidth = useSimulatorStore((state) => state.imagingWidth)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const showLabels = useSimulatorStore((state) => state.showLabels)
  const showSliceHelpers = useSimulatorStore((state) => state.showSliceHelpers)
  const showSlicePlane = useSimulatorStore((state) => state.showSlicePlane)

  if (!showSliceHelpers || !showSlicePlane) {
    return null
  }

  const beamLength = Math.max(0.75, Math.min(imagingDepth, 2.8))
  const normalLength = Math.max(0.42, Math.min(0.78, imagingWidth * 0.32))
  const sliceCenterY = -PROBE_FACE_OFFSET_CM - imagingDepth * 0.48
  const footprintDepth = Math.max(0.14, Math.min(0.34, imagingDepth * 0.1))
  const footprintWidth = Math.max(0.8, imagingWidth * 0.82)

  return (
    <group name="slice-pose-helpers">
      <group position={[0, -PROBE_FACE_OFFSET_CM - beamLength / 2, -0.08]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, beamLength, 12]} />
          <meshBasicMaterial color="#22d3ee" depthWrite={false} opacity={0.52} transparent />
        </mesh>
        <mesh position={[0, -beamLength / 2 - 0.08, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.07, 0.18, 20]} />
          <meshBasicMaterial color="#22d3ee" depthWrite={false} opacity={0.72} transparent />
        </mesh>
      </group>

      {!isPresentationMode ? (
        <>
          <group position={[imagingWidth / 2 + 0.18, sliceCenterY, 0]}>
            <mesh position={[0, 0, normalLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.011, 0.011, normalLength, 10]} />
              <meshBasicMaterial color="#f6c453" depthWrite={false} opacity={0.6} transparent />
            </mesh>
            <mesh position={[0, 0, normalLength + 0.07]} rotation={[Math.PI / 2, 0, 0]}>
              <coneGeometry args={[0.055, 0.15, 18]} />
              <meshBasicMaterial color="#f6c453" depthWrite={false} opacity={0.78} transparent />
            </mesh>
          </group>

          <mesh position={[0, -PROBE_FACE_OFFSET_CM - imagingDepth * 0.6, 0.038]}>
            <planeGeometry args={[footprintWidth, footprintDepth]} />
            <meshBasicMaterial
              color="#e7fbff"
              depthWrite={false}
              opacity={0.16}
              side={DoubleSide}
              transparent
            />
          </mesh>
        </>
      ) : null}

      {showLabels && !isPresentationMode ? (
        <Html
          center
          className="slice-helper-label"
          distanceFactor={7}
          position={[0, -PROBE_FACE_OFFSET_CM - imagingDepth * 0.3, 0.22]}
        >
          Image plane follows probe pose
        </Html>
      ) : null}
    </group>
  )
}
