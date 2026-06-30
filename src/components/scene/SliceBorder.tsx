type SliceBorderProps = {
  depth: number
  width: number
}

const BORDER_THICKNESS = 0.018
const BORDER_Z_OFFSET = 0.012

export function SliceBorder({ depth, width }: SliceBorderProps) {
  return (
    <group>
      <mesh position={[0, 0, BORDER_Z_OFFSET]}>
        <boxGeometry args={[width, BORDER_THICKNESS, BORDER_THICKNESS]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
      <mesh position={[0, -depth, BORDER_Z_OFFSET]}>
        <boxGeometry args={[width, BORDER_THICKNESS, BORDER_THICKNESS]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
      <mesh position={[-width / 2, -depth / 2, BORDER_Z_OFFSET]}>
        <boxGeometry args={[BORDER_THICKNESS, depth, BORDER_THICKNESS]} />
        <meshBasicMaterial color="#f6c453" />
      </mesh>
      <mesh position={[width / 2, -depth / 2, BORDER_Z_OFFSET]}>
        <boxGeometry args={[BORDER_THICKNESS, depth, BORDER_THICKNESS]} />
        <meshBasicMaterial color="#7dd3fc" />
      </mesh>
    </group>
  )
}
