import { Html } from '@react-three/drei'
import { getOrganDisplayLabel, type OrganDefinition } from '../../domain/anatomy'

type OrganLabelProps = {
  organ: OrganDefinition
}

export function OrganLabel({ organ }: OrganLabelProps) {
  if (organ.id === 'torsoEnvelope') {
    return null
  }

  return (
    <Html
      center
      className="organ-label"
      distanceFactor={8}
      position={[organ.center[0], organ.center[1] + organ.radii[1] + 0.16, organ.center[2]]}
    >
      {getOrganDisplayLabel(organ)}
    </Html>
  )
}
