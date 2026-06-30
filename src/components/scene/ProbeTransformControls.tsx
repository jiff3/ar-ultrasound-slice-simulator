import { TransformControls } from '@react-three/drei'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { EulerOrder, Group } from 'three'
import { useSimulatorStore } from '../../app/store'

const PROBE_EULER_ORDER: EulerOrder = 'YXZ'

type ProbeTransformControlsProps = {
  children: ReactNode
}

export function ProbeTransformControls({ children }: ProbeTransformControlsProps) {
  const groupRef = useRef<Group>(null)
  const [probeObject, setProbeObject] = useState<Group | null>(null)
  const probePosition = useSimulatorStore((state) => state.probePosition)
  const probeRotation = useSimulatorStore((state) => state.probeRotation)
  const transformMode = useSimulatorStore((state) => state.transformMode)
  const setProbePose = useSimulatorStore((state) => state.setProbePose)
  const setProbeInteracting = useSimulatorStore((state) => state.setProbeInteracting)

  const setGroupRef = useCallback((group: Group | null) => {
    groupRef.current = group
    setProbeObject(group)
  }, [])

  useEffect(() => {
    const group = groupRef.current

    if (!group) {
      return
    }

    group.position.set(probePosition[0], probePosition[1], probePosition[2])
    group.rotation.set(
      probeRotation.pitch,
      probeRotation.yaw,
      probeRotation.roll,
      PROBE_EULER_ORDER,
    )
  }, [probePosition, probeRotation])

  function syncStoreFromGroup() {
    const group = groupRef.current

    if (!group) {
      return
    }

    group.rotation.reorder(PROBE_EULER_ORDER)
    setProbePose(
      [group.position.x, group.position.y, group.position.z],
      {
        yaw: group.rotation.y,
        pitch: group.rotation.x,
        roll: group.rotation.z,
      },
    )
  }

  return (
    <>
      <group ref={setGroupRef}>{children}</group>
      {probeObject ? (
        <TransformControls
          mode={transformMode}
          object={probeObject}
          onMouseDown={() => setProbeInteracting(true)}
          onMouseUp={() => setProbeInteracting(false)}
          onObjectChange={syncStoreFromGroup}
          size={0.72}
          space="local"
        />
      ) : null}
    </>
  )
}
