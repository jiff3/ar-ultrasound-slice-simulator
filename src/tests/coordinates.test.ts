import { describe, expect, it } from 'vitest'
import {
  DEFAULT_IMAGING_DEPTH_CM,
  DEFAULT_IMAGING_WIDTH_CM,
  PROBE_ACOUSTIC_AXIS,
  degreesToRadians,
  formatAnglesRadians,
  formatVector,
  radiansToDegrees,
} from '../domain/coordinates'

describe('simulator coordinates', () => {
  it('defines positive imaging dimensions in centimeters', () => {
    expect(DEFAULT_IMAGING_WIDTH_CM).toBeGreaterThan(0)
    expect(DEFAULT_IMAGING_DEPTH_CM).toBeGreaterThan(0)
  })

  it('uses probe local -Y as the acoustic beam direction', () => {
    expect(PROBE_ACOUSTIC_AXIS).toEqual({ x: 0, y: -1, z: 0 })
  })

  it('converts between degrees and radians', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI)
    expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90)
  })

  it('formats vector and angle readouts for UI panels', () => {
    expect(formatVector({ x: 1, y: 2, z: 3 })).toBe('x 1.0 cm, y 2.0 cm, z 3.0 cm')
    expect(formatAnglesRadians({ yaw: 0, pitch: Math.PI / 2, roll: Math.PI })).toBe(
      'yaw 0.0 deg, pitch 90.0 deg, roll 180.0 deg',
    )
  })
})
