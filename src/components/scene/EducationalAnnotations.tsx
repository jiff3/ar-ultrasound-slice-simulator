import { Html } from '@react-three/drei'
import { useSimulatorStore } from '../../app/store'
import { PROBE_FACE_OFFSET_CM } from '../../domain/coordinates'

export function EducationalAnnotations() {
  const imagingDepth = useSimulatorStore((state) => state.imagingDepth)
  const imagingWidth = useSimulatorStore((state) => state.imagingWidth)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const showLabels = useSimulatorStore((state) => state.showLabels)
  const showSlicePlane = useSimulatorStore((state) => state.showSlicePlane)

  if (!showLabels || isPresentationMode) {
    return null
  }

  return (
    <group name="educational-annotations">
      {showSlicePlane ? (
        <>
          <AnnotationLabel
            accent="cyan"
            label="Imaging plane"
            position={[imagingWidth / 2 + 0.36, -PROBE_FACE_OFFSET_CM - imagingDepth * 0.34, 0.18]}
          />
          <AnnotationLabel
            accent="cyan"
            label="Depth direction"
            position={[imagingWidth / 2 + 0.28, -PROBE_FACE_OFFSET_CM - imagingDepth * 0.78, 0.12]}
          />
        </>
      ) : null}
    </group>
  )
}

type AnnotationLabelProps = {
  accent: 'cyan' | 'gold' | 'soft'
  label: string
  position: [number, number, number]
}

function AnnotationLabel({ accent, label, position }: AnnotationLabelProps) {
  return (
    <Html
      center
      className={`annotation-label ${accent}`}
      distanceFactor={8}
      position={position}
    >
      <span className="annotation-dot" aria-hidden="true" />
      <span>{label}</span>
    </Html>
  )
}
