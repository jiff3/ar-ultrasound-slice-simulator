type SliceOrientationMarkersProps = {
  depth: number
  width: number
}

const MARKER_Z_OFFSET = 0.028

export function SliceOrientationMarkers({ depth, width }: SliceOrientationMarkersProps) {
  return (
    <group>
      <mesh position={[-width / 2, -Math.min(0.22, depth * 0.18), MARKER_Z_OFFSET]}>
        <sphereGeometry args={[0.055, 18, 10]} />
        <meshStandardMaterial color="#f6c453" emissive="#f6c453" emissiveIntensity={0.45} />
      </mesh>

      <group position={[width / 2 + 0.12, -depth * 0.5, MARKER_Z_OFFSET]}>
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.03, Math.min(0.52, depth * 0.35), 0.03]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
        <mesh position={[0, -0.12, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.08, 0.18, 20]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      </group>
    </group>
  )
}
