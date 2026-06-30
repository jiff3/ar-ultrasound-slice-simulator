import { useSimulatorStore } from '../../app/store'
import { SYNTHETIC_ORGANS } from '../../domain/anatomy'
import { OrganMesh } from './OrganMesh'

const TORSO_ID = 'torsoEnvelope'
const TORSO_ORGAN = SYNTHETIC_ORGANS.find((organ) => organ.id === TORSO_ID)
const INTERNAL_ORGANS = SYNTHETIC_ORGANS.filter((organ) => organ.id !== TORSO_ID)

export function AnatomyPhantom() {
  const showOrgans = useSimulatorStore((state) => state.showOrgans)
  const showLabels = useSimulatorStore((state) => state.showLabels)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const showOrganLabels = showLabels && !isPresentationMode

  return (
    <group name="synthetic-anatomy-phantom">
      {TORSO_ORGAN ? (
        <OrganMesh organ={TORSO_ORGAN} showLabel={showOrganLabels} variant="envelope" />
      ) : null}
      {showOrgans
        ? INTERNAL_ORGANS.map((organ) => (
            <OrganMesh key={organ.id} organ={organ} showLabel={showOrganLabels} />
          ))
        : null}
    </group>
  )
}
