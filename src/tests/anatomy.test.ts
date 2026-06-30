import { describe, expect, it } from 'vitest'
import {
  SYNTHETIC_ORGANS,
  getNearestOrganBoundaryStrength,
  getOrganAtPoint,
  isPointInsideEllipsoid,
  normalizedEllipsoidDistance,
} from '../domain/anatomy'

describe('synthetic anatomy model', () => {
  it('defines the required phantom organs', () => {
    expect(SYNTHETIC_ORGANS.map((organ) => organ.id)).toEqual([
      'torsoEnvelope',
      'liverLikeRegion',
      'kidneyLikeRegion',
      'lesionTarget',
      'vesselLikeRegion',
      'deepSoftTissue',
    ])
  })

  it('treats a point at an organ center as inside the ellipsoid', () => {
    const liver = SYNTHETIC_ORGANS[1]

    expect(isPointInsideEllipsoid(liver.center, liver)).toBe(true)
  })

  it('treats a far away point as outside the ellipsoid', () => {
    const liver = SYNTHETIC_ORGANS[1]

    expect(isPointInsideEllipsoid([100, 100, 100], liver)).toBe(false)
  })

  it('measures normalized ellipsoid distance from center to boundary', () => {
    const liver = SYNTHETIC_ORGANS[1]
    const [centerX, centerY, centerZ] = liver.center
    const [radiusX] = liver.radii

    expect(normalizedEllipsoidDistance(liver.center, liver)).toBeCloseTo(0)
    expect(normalizedEllipsoidDistance([centerX + radiusX, centerY, centerZ], liver)).toBeCloseTo(
      1,
    )
    expect(isPointInsideEllipsoid([centerX + radiusX * 1.2, centerY, centerZ], liver)).toBe(false)
  })

  it('selects the most specific organ containing a point', () => {
    const lesion = SYNTHETIC_ORGANS[3]

    expect(getOrganAtPoint(lesion.center)?.id).toBe('lesionTarget')
  })

  it('falls back to the torso envelope for generic phantom points', () => {
    expect(getOrganAtPoint([0, 2, 0])?.id).toBe('torsoEnvelope')
  })

  it('returns edge contribution near an organ boundary', () => {
    const lesion = SYNTHETIC_ORGANS[3]
    const [centerX, centerY, centerZ] = lesion.center
    const [radiusX] = lesion.radii

    const centerStrength = getNearestOrganBoundaryStrength(lesion.center, lesion)
    const edgeStrength = getNearestOrganBoundaryStrength([centerX + radiusX, centerY, centerZ], lesion)
    const farStrength = getNearestOrganBoundaryStrength(
      [centerX + radiusX * 1.4, centerY, centerZ],
      lesion,
    )

    expect(edgeStrength).toBeGreaterThan(centerStrength)
    expect(edgeStrength).toBeCloseTo(lesion.ultrasoundEdgeIntensity)
    expect(farStrength).toBe(0)
  })
})
