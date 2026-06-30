import type { Matrix4 } from 'three'
import {
  isPointInsideEllipsoid,
  normalizedEllipsoidDistance,
  SYNTHETIC_ABDOMINAL_PHANTOM,
  type OrganDefinition,
  type PhantomDefinition,
  type Point3,
} from './anatomy'
import { centeredSpeckle, scanlineNoise } from './noise'

export const ULTRASOUND_TEXTURE_WIDTH = 192
export const ULTRASOUND_TEXTURE_HEIGHT = 256
const EDGE_FALLOFF_NORMALIZED_DISTANCE = 0.08

type PhantomSample = Readonly<{
  organ?: OrganDefinition
  boundaryStrength: number
  vesselDistance: number | undefined
}>

export type RenderUltrasoundOptions = Readonly<{
  canvas: HTMLCanvasElement
  probeMatrixWorld: Matrix4
  imagingWidth: number
  imagingDepth: number
  gain: number
  phantom?: PhantomDefinition
  probeFaceOffset?: number
  seed?: number
}>

export type UltrasoundIntensityOptions = Readonly<{
  worldPoint: Point3
  depth: number
  imagingDepth: number
  gain: number
  phantom?: PhantomDefinition
  pixelX: number
  pixelY: number
  seed?: number
}>

export function createUltrasoundCanvas(
  widthPx = ULTRASOUND_TEXTURE_WIDTH,
  heightPx = ULTRASOUND_TEXTURE_HEIGHT,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = widthPx
  canvas.height = heightPx

  return canvas
}

export function renderUltrasoundToCanvas({
  canvas,
  probeMatrixWorld,
  imagingWidth,
  imagingDepth,
  gain,
  phantom = SYNTHETIC_ABDOMINAL_PHANTOM,
  probeFaceOffset = 0,
  seed = 0,
}: RenderUltrasoundOptions): HTMLCanvasElement {
  const context = canvas.getContext('2d')

  if (!context) {
    return canvas
  }

  const { width, height } = canvas
  const imageData = context.createImageData(width, height)
  const pixels = imageData.data
  const matrixElements = probeMatrixWorld.elements
  const worldPoint: [number, number, number] = [0, 0, 0]

  for (let pixelY = 0; pixelY < height; pixelY += 1) {
    const depth = ((pixelY + 0.5) / height) * imagingDepth
    const localY = -(probeFaceOffset + depth)
    const lineNoise = scanlineNoise(pixelY, seed) * 0.04

    for (let pixelX = 0; pixelX < width; pixelX += 1) {
      const localX = (((pixelX + 0.5) / width) - 0.5) * imagingWidth
      worldPoint[0] = matrixElements[0] * localX + matrixElements[4] * localY + matrixElements[12]
      worldPoint[1] = matrixElements[1] * localX + matrixElements[5] * localY + matrixElements[13]
      worldPoint[2] = matrixElements[2] * localX + matrixElements[6] * localY + matrixElements[14]
      const intensity = getUltrasoundIntensity({
        worldPoint,
        depth,
        imagingDepth,
        gain,
        phantom,
        pixelX,
        pixelY,
        seed,
      })
      const grayscale = Math.round(applyDisplayCurve(clamp01(intensity + lineNoise)) * 255)
      const pixelIndex = (pixelY * width + pixelX) * 4

      pixels[pixelIndex] = grayscale
      pixels[pixelIndex + 1] = grayscale
      pixels[pixelIndex + 2] = grayscale
      pixels[pixelIndex + 3] = 248
    }
  }

  context.putImageData(imageData, 0, 0)

  return canvas
}

export function samplePhantomAtWorldPoint(
  point: Point3,
  phantom: PhantomDefinition = SYNTHETIC_ABDOMINAL_PHANTOM,
): PhantomSample {
  let organ: OrganDefinition | undefined
  let nearestSpecificVolume = Number.POSITIVE_INFINITY
  let boundaryStrength = 0
  let vesselDistance: number | undefined

  for (const candidate of phantom.organs) {
    const normalizedDistance = normalizedEllipsoidDistance(point, candidate)
    const volumeScore = candidate.radii[0] * candidate.radii[1] * candidate.radii[2]

    if (normalizedDistance <= 1 && volumeScore < nearestSpecificVolume) {
      organ = candidate
      nearestSpecificVolume = volumeScore
    }

    const distanceFromBoundary = Math.abs(1 - normalizedDistance)
    const isNearBoundary = distanceFromBoundary < 0.12

    if (isNearBoundary) {
      const boundaryProximity = clamp01(
        1 - distanceFromBoundary / EDGE_FALLOFF_NORMALIZED_DISTANCE,
      )
      boundaryStrength = Math.max(
        boundaryStrength,
        boundaryProximity * candidate.ultrasoundEdgeIntensity,
      )
    }

    if (candidate.id === 'vesselLikeRegion') {
      vesselDistance = normalizedDistance
    }
  }

  return {
    organ,
    boundaryStrength,
    vesselDistance,
  }
}

export function getUltrasoundIntensity({
  worldPoint,
  depth,
  imagingDepth,
  gain,
  phantom = SYNTHETIC_ABDOMINAL_PHANTOM,
  pixelX,
  pixelY,
  seed = 0,
}: UltrasoundIntensityOptions): number {
  const sample = samplePhantomAtWorldPoint(worldPoint, phantom)
  const organ = sample.organ
  const depthRatio = imagingDepth <= 0 ? 0 : depth / imagingDepth
  const attenuation = Math.max(0.28, 1 - depthRatio * 0.72)
  const nearFieldLine = depthRatio < 0.045 ? 0.62 * (1 - depthRatio / 0.045) : 0
  const baseline = organ ? organ.ultrasoundBaseIntensity : 0.035
  const speckleStrength = (organ ? organ.ultrasoundSpeckleStrength : 0.12) * 1.75
  const speckle = centeredSpeckle(worldPoint[0], worldPoint[1], worldPoint[2], seed)
  const fineSpeckle = centeredSpeckle(worldPoint[0] * 2.7, worldPoint[1] * 2.7, worldPoint[2] * 2.7, seed + 31)
  const subtleHorizontalBand = Math.sin(pixelY * 0.22 + pixelX * 0.01) * 0.022
  const isInsideVessel =
    organ?.id === 'vesselLikeRegion' ||
    (sample.vesselDistance !== undefined && sample.vesselDistance < 0.96)
  const vesselCenterWeight = isInsideVessel ? 1 - Math.min(sample.vesselDistance ?? 1, 1) : 0
  const vesselLumen = isInsideVessel ? -0.52 * vesselCenterWeight : 0
  const vesselWallBoost =
    sample.vesselDistance !== undefined && Math.abs(1 - sample.vesselDistance) < 0.11 ? 0.42 : 0
  const boundaryBoost = sample.boundaryStrength * 1.9
  const lesionHighlight = organ?.id === 'lesionTarget' ? 0.24 : 0
  const scatter = speckle * speckleStrength + Math.max(0, fineSpeckle) * speckleStrength * 0.48
  const outsideTorsoFade = organ ? 0 : getOutsideTorsoFade(worldPoint, phantom.organs)

  const rawIntensity =
    (baseline +
      boundaryBoost +
      vesselWallBoost +
      lesionHighlight +
      vesselLumen +
      scatter +
      subtleHorizontalBand +
      nearFieldLine) *
    attenuation *
    gain

  return clamp01((rawIntensity + outsideTorsoFade - 0.04) * 1.38 + 0.04)
}

function applyDisplayCurve(value: number): number {
  return clamp01(
    Math.pow(value, 0.78) * 1.08 + (value > 0.72 ? (value - 0.72) * 0.35 : 0),
  )
}

function getOutsideTorsoFade(point: Point3, organs: readonly OrganDefinition[]): number {
  const torso = organs.find((organ) => organ.id === 'torsoEnvelope')

  if (!torso || isPointInsideEllipsoid(point, torso)) {
    return 0
  }

  const distance = normalizedEllipsoidDistance(point, torso)

  return distance < 1.1 ? 0.03 : 0
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}
