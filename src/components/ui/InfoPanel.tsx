import { useSimulatorStore } from '../../app/store'
import { getOrganDisplayLabel, SYNTHETIC_ORGANS } from '../../domain/anatomy'
import { formatAnglesRadians, formatCentimeters, formatVector } from '../../domain/coordinates'

export function InfoPanel() {
  const freezeImage = useSimulatorStore((state) => state.freezeImage)
  const imagingDepth = useSimulatorStore((state) => state.imagingDepth)
  const imagingWidth = useSimulatorStore((state) => state.imagingWidth)
  const isPresentationMode = useSimulatorStore((state) => state.isPresentationMode)
  const probePosition = useSimulatorStore((state) => state.probePosition)
  const probeRotation = useSimulatorStore((state) => state.probeRotation)
  const transformMode = useSimulatorStore((state) => state.transformMode)

  const readouts = [
    {
      label: 'Probe position X/Y/Z',
      value: formatVector({ x: probePosition[0], y: probePosition[1], z: probePosition[2] }),
    },
    { label: 'Yaw / pitch / roll', value: formatAnglesRadians(probeRotation) },
    { label: 'Imaging width', value: formatCentimeters(imagingWidth) },
    { label: 'Imaging depth', value: formatCentimeters(imagingDepth) },
    { label: 'Current mode', value: transformMode },
    { label: 'Image state', value: freezeImage ? 'Frozen' : 'Live' },
    { label: 'Performance mode', value: isPresentationMode ? 'Presentation' : 'Full labels' },
    { label: 'Beam axis', value: 'probe local -Y' },
  ] as const

  return (
    <section className="glass-panel">
      <div className="panel-heading">
        <span className="eyebrow">Probe pose</span>
        <h2>Spatial readout</h2>
      </div>

      <dl className="readout-list">
        {readouts.map((item) => (
          <div className="readout-row" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <p className="project-explanation">
        Conventional ultrasound requires the operator to mentally map a 2D image to 3D anatomy.
        This simulator attaches the image to the probe's actual slice plane, demonstrating the
        intuition behind AR in-situ visualization.
      </p>

      <div className="organ-legend" aria-label="Synthetic organ legend">
        <span className="legend-title">Synthetic anatomy</span>
        {SYNTHETIC_ORGANS.filter((organ) => organ.id !== 'torsoEnvelope').map((organ) => (
          <div className="legend-row" key={organ.id}>
            <span className="legend-swatch" style={{ backgroundColor: organ.displayColor }} />
            <span>{getOrganDisplayLabel(organ)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
