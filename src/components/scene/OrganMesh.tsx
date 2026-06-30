import { memo } from 'react'
import { DoubleSide, FrontSide } from 'three'
import type { OrganDefinition } from '../../domain/anatomy'
import { OrganLabel } from './OrganLabel'

type OrganMeshProps = {
  organ: OrganDefinition
  showLabel: boolean
  variant?: 'envelope' | 'organ'
}

export const OrganMesh = memo(function OrganMesh({
  organ,
  showLabel,
  variant = 'organ',
}: OrganMeshProps) {
  const isEnvelope = variant === 'envelope'

  return (
    <group>
      <mesh
        position={[organ.center[0], organ.center[1], organ.center[2]]}
        renderOrder={isEnvelope ? 0 : 1}
        scale={[organ.radii[0], organ.radii[1], organ.radii[2]]}
      >
        <sphereGeometry args={[1, isEnvelope ? 28 : 20, isEnvelope ? 14 : 10]} />
        <meshStandardMaterial
          color={organ.displayColor}
          depthWrite={false}
          emissive={isEnvelope ? '#1c3340' : organ.displayColor}
          emissiveIntensity={isEnvelope ? 0.08 : 0.04}
          metalness={0.02}
          opacity={isEnvelope ? organ.displayOpacity : Math.min(0.82, organ.displayOpacity)}
          roughness={0.65}
          side={isEnvelope ? DoubleSide : FrontSide}
          transparent
          wireframe={isEnvelope}
        />
      </mesh>
      {showLabel ? <OrganLabel organ={organ} /> : null}
    </group>
  )
})
