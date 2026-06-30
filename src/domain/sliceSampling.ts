import { Matrix4, Vector3 } from 'three'
import type { Point3 } from './anatomy'

const reusableVector = new Vector3()

export type LocalSlicePoint = Readonly<{
  x: number
  y: number
  z: number
  depth: number
}>

export type SlicePixelToWorldOptions = Readonly<{
  pixelX: number
  pixelY: number
  widthPx: number
  heightPx: number
  imagingWidth: number
  imagingDepth: number
  probeMatrixWorld: Matrix4
  probeFaceOffset?: number
}>

export function localSlicePixelToWorld(options: SlicePixelToWorldOptions): Point3 {
  const localPoint = localSlicePixelToProbePoint(options)

  reusableVector.set(localPoint.x, localPoint.y, localPoint.z)
  reusableVector.applyMatrix4(options.probeMatrixWorld)

  return [reusableVector.x, reusableVector.y, reusableVector.z]
}

export function localSlicePixelToProbePoint({
  pixelX,
  pixelY,
  widthPx,
  heightPx,
  imagingWidth,
  imagingDepth,
  probeFaceOffset = 0,
}: Omit<SlicePixelToWorldOptions, 'probeMatrixWorld'>): LocalSlicePoint {
  const xRatio = (pixelX + 0.5) / widthPx
  const depthRatio = (pixelY + 0.5) / heightPx
  const x = (xRatio - 0.5) * imagingWidth
  const depth = depthRatio * imagingDepth

  return {
    x,
    y: -(probeFaceOffset + depth),
    z: 0,
    depth,
  }
}
