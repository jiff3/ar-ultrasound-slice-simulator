export function hashNoise2D(x: number, y: number, seed = 0): number {
  const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123

  return fract(value)
}

export function hashNoise3D(x: number, y: number, z: number, seed = 0): number {
  const value = Math.sin(x * 127.1 + y * 311.7 + z * 269.5 + seed * 91.7) * 43758.5453123

  return fract(value)
}

export function centeredSpeckle(x: number, y: number, z: number, seed = 0): number {
  const fine = hashNoise3D(x * 42, y * 42, z * 42, seed)
  const medium = hashNoise3D(x * 18, y * 18, z * 18, seed + 13)
  const coarse = hashNoise3D(x * 7, y * 7, z * 7, seed + 29)

  return fine * 0.58 + medium * 0.3 + coarse * 0.12 - 0.5
}

export function scanlineNoise(row: number, seed = 0): number {
  return hashNoise2D(row, seed * 17.3, seed + 41) - 0.5
}

function fract(value: number): number {
  return value - Math.floor(value)
}
