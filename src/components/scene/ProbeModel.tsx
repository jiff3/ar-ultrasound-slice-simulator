import { Html } from '@react-three/drei'
import { useMemo } from 'react'
import { CatmullRomCurve3, DoubleSide, Vector3 } from 'three'
import { useSimulatorStore } from '../../app/store'

export function ProbeModel() {
  const showLabels = useSimulatorStore((state) => state.showLabels)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const cableCurve = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(0, 1.12, 0),
        new Vector3(0.12, 1.42, -0.08),
        new Vector3(0.5, 1.65, -0.28),
        new Vector3(0.88, 1.92, -0.44),
      ]),
    [],
  )

  return (
    <group name="virtual-ultrasound-probe">
      <mesh position={[0, -0.02, 0]} castShadow>
        <boxGeometry args={[0.94, 0.26, 0.48]} />
        <meshStandardMaterial color="#dde8ef" metalness={0.18} roughness={0.34} />
      </mesh>

      <mesh position={[0, 0.24, 0]} castShadow>
        <boxGeometry args={[0.56, 0.26, 0.36]} />
        <meshStandardMaterial color="#b6c5d0" metalness={0.14} roughness={0.38} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 0.98, 32]} />
        <meshStandardMaterial color="#8798a7" metalness={0.12} roughness={0.46} />
      </mesh>

      <mesh position={[0, 1.17, 0]} castShadow>
        <sphereGeometry args={[0.17, 24, 14]} />
        <meshStandardMaterial color="#6f8292" metalness={0.12} roughness={0.5} />
      </mesh>

      <mesh>
        <tubeGeometry args={[cableCurve, 36, 0.026, 8, false]} />
        <meshStandardMaterial color="#1b252d" roughness={0.58} />
      </mesh>

      <mesh position={[-0.5, -0.02, 0]} castShadow>
        <boxGeometry args={[0.055, 0.28, 0.54]} />
        <meshStandardMaterial color="#f6c453" emissive="#f6c453" emissiveIntensity={0.28} />
      </mesh>

      <mesh position={[0, -0.165, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.84, 0.4]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.72}
          opacity={0.86}
          side={DoubleSide}
          transparent
        />
      </mesh>

      {showLabels && !isPresentationMode ? (
        <Html center className="probe-label" distanceFactor={7} position={[0, 1.22, 0]}>
          Probe
        </Html>
      ) : null}
    </group>
  )
}
