import { EducationalAnnotations } from './EducationalAnnotations'
import { ProbeModel } from './ProbeModel'
import { ProbeTransformControls } from './ProbeTransformControls'
import { SlicePoseHelpers } from './SlicePoseHelpers'
import { UltrasoundPlane } from './UltrasoundPlane'

export function UltrasoundProbe() {
  return (
    <ProbeTransformControls>
      <ProbeModel />
      <UltrasoundPlane />
      <SlicePoseHelpers />
      <EducationalAnnotations />
    </ProbeTransformControls>
  )
}
