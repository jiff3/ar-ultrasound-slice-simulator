export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.48} />
      <hemisphereLight args={['#d8f6ff', '#17202a', 0.52]} />
      <directionalLight position={[5, 8, 4]} intensity={1.35} />
    </>
  )
}
