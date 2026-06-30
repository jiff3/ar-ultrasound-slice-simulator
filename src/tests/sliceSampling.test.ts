import { Matrix4 } from 'three'
import { describe, expect, it } from 'vitest'
import { PROBE_FACE_OFFSET_CM } from '../domain/coordinates'
import { localSlicePixelToProbePoint, localSlicePixelToWorld } from '../domain/sliceSampling'

describe('slice sampling', () => {
  it('maps a local slice pixel to the expected probe-local point', () => {
    const point = localSlicePixelToProbePoint({
      pixelX: 0,
      pixelY: 0,
      widthPx: 2,
      heightPx: 2,
      imagingWidth: 2,
      imagingDepth: 4,
      probeFaceOffset: PROBE_FACE_OFFSET_CM,
    })

    expect(point.x).toBeCloseTo(-0.5)
    expect(point.y).toBeCloseTo(-(PROBE_FACE_OFFSET_CM + 1))
    expect(point.z).toBeCloseTo(0)
    expect(point.depth).toBeCloseTo(1)
  })

  it('maps identity probe rotation to the expected world point', () => {
    const worldPoint = localSlicePixelToWorld({
      pixelX: 0,
      pixelY: 0,
      widthPx: 2,
      heightPx: 2,
      imagingWidth: 2,
      imagingDepth: 4,
      probeFaceOffset: 0,
      probeMatrixWorld: new Matrix4().identity(),
    })

    expect(worldPoint[0]).toBeCloseTo(-0.5)
    expect(worldPoint[1]).toBeCloseTo(-1)
    expect(worldPoint[2]).toBeCloseTo(0)
  })

  it('changes the sampled world point when probe position changes', () => {
    const translatedMatrix = new Matrix4().makeTranslation(3, 4, 5)
    const worldPoint = localSlicePixelToWorld({
      pixelX: 0,
      pixelY: 0,
      widthPx: 2,
      heightPx: 2,
      imagingWidth: 2,
      imagingDepth: 4,
      probeFaceOffset: 0,
      probeMatrixWorld: translatedMatrix,
    })

    expect(worldPoint[0]).toBeCloseTo(2.5)
    expect(worldPoint[1]).toBeCloseTo(3)
    expect(worldPoint[2]).toBeCloseTo(5)
  })
})
