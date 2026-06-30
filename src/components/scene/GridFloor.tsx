export function GridFloor() {
  return (
    <group>
      <gridHelper args={[8, 16, '#2dd4bf', '#20313a']} position={[0, -0.02, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#111c24" opacity={0.62} transparent roughness={0.9} />
      </mesh>
    </group>
  )
}
