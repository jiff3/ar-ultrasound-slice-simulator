export type Point3 = readonly [x: number, y: number, z: number]

export type OrganId =
  | 'torsoEnvelope'
  | 'liverLikeRegion'
  | 'kidneyLikeRegion'
  | 'lesionTarget'
  | 'vesselLikeRegion'
  | 'deepSoftTissue'

export type OrganDefinition = Readonly<{
  id: OrganId
  label: string
  center: Point3
  radii: Point3
  displayColor: string
  displayOpacity: number
  ultrasoundBaseIntensity: number
  ultrasoundEdgeIntensity: number
  ultrasoundSpeckleStrength: number
  description: string
}>

export type PhantomDefinition = Readonly<{
  id: string
  label: string
  description: string
  organs: readonly OrganDefinition[]
}>

const EDGE_FALLOFF_NORMALIZED_DISTANCE = 0.08

export const SYNTHETIC_ABDOMINAL_PHANTOM = {
  id: 'synthetic-abdominal-phantom',
  label: 'Synthetic Abdominal Phantom',
  description:
    'Simplified educational phantom made from ellipsoids. All dimensions are approximate centimeters in the simulator coordinate system.',
  organs: [
    {
      id: 'torsoEnvelope',
      label: 'Torso / skin envelope',
      center: [0, 0, 0],
      radii: [2.15, 3, 1.35],
      displayColor: '#f2b39f',
      displayOpacity: 0.2,
      ultrasoundBaseIntensity: 0.18,
      ultrasoundEdgeIntensity: 0.24,
      ultrasoundSpeckleStrength: 0.18,
      description:
        'Translucent outer phantom volume representing skin and generic superficial tissue.',
    },
    {
      id: 'liverLikeRegion',
      label: 'Liver-like ellipsoid',
      center: [-0.55, -0.1, 0.15],
      radii: [1, 0.82, 0.55],
      displayColor: '#9b5f4b',
      displayOpacity: 0.68,
      ultrasoundBaseIntensity: 0.5,
      ultrasoundEdgeIntensity: 0.32,
      ultrasoundSpeckleStrength: 0.25,
      description:
        'Large synthetic parenchymal organ target with medium echogenicity and visible speckle.',
    },
    {
      id: 'kidneyLikeRegion',
      label: 'Kidney-like ellipsoid',
      center: [0.85, -0.45, -0.4],
      radii: [0.38, 0.62, 0.28],
      displayColor: '#8f4864',
      displayOpacity: 0.72,
      ultrasoundBaseIntensity: 0.42,
      ultrasoundEdgeIntensity: 0.38,
      ultrasoundSpeckleStrength: 0.2,
      description:
        'Smaller posterior ellipsoid used as a synthetic kidney-like landmark.',
    },
    {
      id: 'lesionTarget',
      label: 'Round lesion target',
      center: [-0.45, -0.05, 0.52],
      radii: [0.18, 0.18, 0.18],
      displayColor: '#f2d35e',
      displayOpacity: 0.82,
      ultrasoundBaseIntensity: 0.76,
      ultrasoundEdgeIntensity: 0.5,
      ultrasoundSpeckleStrength: 0.12,
      description:
        'Small bright spherical target nested in the liver-like region for slice-localization practice.',
    },
    {
      id: 'vesselLikeRegion',
      label: 'Vessel-like ellipsoid',
      center: [0.1, -0.15, 0.55],
      radii: [0.12, 0.95, 0.12],
      displayColor: '#46a6d9',
      displayOpacity: 0.78,
      ultrasoundBaseIntensity: 0.1,
      ultrasoundEdgeIntensity: 0.46,
      ultrasoundSpeckleStrength: 0.05,
      description:
        'Long narrow ellipsoid standing in for a vessel-like fluid structure with dark interior and bright boundary.',
    },
    {
      id: 'deepSoftTissue',
      label: 'Deep soft-tissue region',
      center: [0.15, -1.2, -0.25],
      radii: [1.25, 0.8, 0.72],
      displayColor: '#c5866f',
      displayOpacity: 0.34,
      ultrasoundBaseIntensity: 0.3,
      ultrasoundEdgeIntensity: 0.2,
      ultrasoundSpeckleStrength: 0.28,
      description:
        'Broad deeper background region that gives the lower phantom a different ultrasound texture.',
    },
  ],
} as const satisfies PhantomDefinition

export const SYNTHETIC_ORGANS = SYNTHETIC_ABDOMINAL_PHANTOM.organs

const ORGAN_DISPLAY_LABELS: Record<OrganId, string> = {
  torsoEnvelope: 'Torso',
  liverLikeRegion: 'Liver',
  kidneyLikeRegion: 'Kidney',
  lesionTarget: 'Lesion',
  vesselLikeRegion: 'Vessel',
  deepSoftTissue: 'Soft tissue',
}

export function getOrganDisplayLabel(organ: OrganDefinition): string {
  return ORGAN_DISPLAY_LABELS[organ.id]
}

export function normalizedEllipsoidDistance(point: Point3, organ: OrganDefinition): number {
  const [pointX, pointY, pointZ] = point
  const [centerX, centerY, centerZ] = organ.center
  const [radiusX, radiusY, radiusZ] = organ.radii

  const normalizedX = (pointX - centerX) / radiusX
  const normalizedY = (pointY - centerY) / radiusY
  const normalizedZ = (pointZ - centerZ) / radiusZ

  return Math.sqrt(
    normalizedX * normalizedX + normalizedY * normalizedY + normalizedZ * normalizedZ,
  )
}

export function isPointInsideEllipsoid(point: Point3, organ: OrganDefinition): boolean {
  return normalizedEllipsoidDistance(point, organ) <= 1
}

export function getOrganAtPoint(
  point: Point3,
  organs: readonly OrganDefinition[] = SYNTHETIC_ORGANS,
): OrganDefinition | undefined {
  let nearestSpecificOrgan: OrganDefinition | undefined
  let nearestSpecificVolume = Number.POSITIVE_INFINITY

  for (const organ of organs) {
    if (!isPointInsideEllipsoid(point, organ)) {
      continue
    }

    const volumeScore = getEllipsoidVolumeScore(organ)

    if (volumeScore < nearestSpecificVolume) {
      nearestSpecificOrgan = organ
      nearestSpecificVolume = volumeScore
    }
  }

  return nearestSpecificOrgan
}

export function getNearestOrganBoundaryStrength(point: Point3, organ: OrganDefinition): number {
  const distanceFromBoundary = Math.abs(1 - normalizedEllipsoidDistance(point, organ))
  const boundaryProximity = clamp01(1 - distanceFromBoundary / EDGE_FALLOFF_NORMALIZED_DISTANCE)

  return boundaryProximity * organ.ultrasoundEdgeIntensity
}

function getEllipsoidVolumeScore(organ: OrganDefinition): number {
  const [radiusX, radiusY, radiusZ] = organ.radii

  return radiusX * radiusY * radiusZ
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}
