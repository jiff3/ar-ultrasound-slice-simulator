import { Matrix4 } from 'three'
import { describe, expect, it } from 'vitest'
import { SYNTHETIC_ORGANS } from '../domain/anatomy'
import {
  getUltrasoundIntensity,
  renderUltrasoundToCanvas,
  samplePhantomAtWorldPoint,
} from '../domain/ultrasoundRenderer'

describe('procedural ultrasound renderer', () => {
  it('samples organ tissue through the center of an organ', () => {
    const lesion = SYNTHETIC_ORGANS.find((organ) => organ.id === 'lesionTarget')

    expect(lesion).toBeDefined()
    expect(samplePhantomAtWorldPoint(lesion!.center).organ?.id).toBe('lesionTarget')
  })

  it('returns stronger organ intensity than distant background intensity', () => {
    const liver = SYNTHETIC_ORGANS.find((organ) => organ.id === 'liverLikeRegion')

    expect(liver).toBeDefined()

    const organIntensity = getUltrasoundIntensity({
      worldPoint: liver!.center,
      depth: 1,
      imagingDepth: 4,
      gain: 1,
      pixelX: 12,
      pixelY: 18,
      seed: 7,
    })
    const backgroundIntensity = getUltrasoundIntensity({
      worldPoint: [20, 20, 20],
      depth: 1,
      imagingDepth: 4,
      gain: 1,
      pixelX: 12,
      pixelY: 18,
      seed: 7,
    })

    expect(organIntensity).toBeGreaterThan(backgroundIntensity)
    expect(backgroundIntensity).toBeGreaterThanOrEqual(0)
  })

  it('keeps renderer noise deterministic for the same sample', () => {
    const options = {
      worldPoint: SYNTHETIC_ORGANS[3].center,
      depth: 1.3,
      imagingDepth: 4,
      gain: 1.1,
      pixelX: 22,
      pixelY: 31,
      seed: 17,
    }

    expect(getUltrasoundIntensity(options)).toBe(getUltrasoundIntensity(options))
  })

  it('renders non-empty image data into a canvas-like target', () => {
    const canvas = createTestCanvas(24, 32)

    renderUltrasoundToCanvas({
      canvas: canvas.element,
      probeMatrixWorld: new Matrix4().makeTranslation(-0.55, 1.2, 0.15),
      imagingWidth: 1.4,
      imagingDepth: 3,
      gain: 1,
      seed: 9,
    })

    const renderedData = canvas.getRenderedData()

    expect(renderedData).toBeDefined()
    expect(renderedData!.some((value) => value > 0)).toBe(true)
    expect(renderedData!.some((value) => value !== renderedData![0])).toBe(true)
  })
})

function createTestCanvas(width: number, height: number) {
  let renderedData: Uint8ClampedArray | undefined

  const context = {
    createImageData: (imageWidth: number, imageHeight: number) =>
      ({
        data: new Uint8ClampedArray(imageWidth * imageHeight * 4),
        height: imageHeight,
        width: imageWidth,
      }) as ImageData,
    putImageData: (imageData: ImageData) => {
      renderedData = new Uint8ClampedArray(imageData.data)
    },
  }

  const element = {
    width,
    height,
    getContext: (contextType: string) => (contextType === '2d' ? context : null),
  } as unknown as HTMLCanvasElement

  return {
    element,
    getRenderedData: () => renderedData,
  }
}
