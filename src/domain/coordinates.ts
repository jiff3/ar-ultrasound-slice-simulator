export const DEFAULT_IMAGING_WIDTH_CM = 2
export const DEFAULT_IMAGING_DEPTH_CM = 3.5
export const DEFAULT_SLICE_THICKNESS_CM = 0.25
export const PROBE_FACE_OFFSET_CM = 0.16

export const WORLD_UNIT_LABEL = 'cm'

export type VectorLike = Readonly<{
  x: number
  y: number
  z: number
}>

export type EulerAnglesRadians = Readonly<{
  yaw: number
  pitch: number
  roll: number
}>

export type EulerAnglesDegrees = Readonly<{
  yaw: number
  pitch: number
  roll: number
}>

// Simulator world coordinates:
// X = patient left/right, Y = vertical/superior, Z = anterior/posterior depth.
// Probe local coordinates:
// local X spans the transducer width, local -Y is the acoustic beam direction,
// and local Z is the slice thickness / imaging-plane normal direction.
export const PROBE_ACOUSTIC_AXIS = Object.freeze({ x: 0, y: -1, z: 0 })
export const PROBE_WIDTH_AXIS = Object.freeze({ x: 1, y: 0, z: 0 })
export const PROBE_SLICE_NORMAL_AXIS = Object.freeze({ x: 0, y: 0, z: 1 })

const DEFAULT_DECIMALS = 1

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

export function formatCentimeters(value: number, decimals = DEFAULT_DECIMALS): string {
  return `${formatNumber(value, decimals)} ${WORLD_UNIT_LABEL}`
}

export function formatDegrees(value: number, decimals = DEFAULT_DECIMALS): string {
  return `${formatNumber(value, decimals)} deg`
}

export function formatVector(vector: VectorLike, decimals = DEFAULT_DECIMALS): string {
  return `x ${formatCentimeters(vector.x, decimals)}, y ${formatCentimeters(
    vector.y,
    decimals,
  )}, z ${formatCentimeters(vector.z, decimals)}`
}

export function formatAnglesRadians(
  angles: EulerAnglesRadians,
  decimals = DEFAULT_DECIMALS,
): string {
  return formatAnglesDegrees(
    {
      yaw: radiansToDegrees(angles.yaw),
      pitch: radiansToDegrees(angles.pitch),
      roll: radiansToDegrees(angles.roll),
    },
    decimals,
  )
}

export function formatAnglesDegrees(
  angles: EulerAnglesDegrees,
  decimals = DEFAULT_DECIMALS,
): string {
  return `yaw ${formatDegrees(angles.yaw, decimals)}, pitch ${formatDegrees(
    angles.pitch,
    decimals,
  )}, roll ${formatDegrees(angles.roll, decimals)}`
}

function formatNumber(value: number, decimals: number): string {
  return value.toFixed(decimals)
}
