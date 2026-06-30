# AR-Style Ultrasound Slice Visualization Simulator

## Project Goal

Build a browser-based React, TypeScript, Vite, and Three.js prototype that visualizes how a virtual ultrasound probe produces a synthetic 2D slice through a simplified 3D torso phantom. The user should be able to move and rotate the probe, see the imaging plane remain physically attached to it, and compare the correctly oriented in-situ slice with intentionally incorrect mirrored or rotated views.

The project is intended as a polished portfolio and research-communication artifact for spatial computing, biomedical visualization, and interactive simulation work.

## Non-Medical Educational Disclaimer

This project is an educational visualization simulator only. It is not a medical device, not real augmented reality, not clinical ultrasound software, and not diagnostic software.

The app must use synthetic anatomy, simplified geometry, and procedural ultrasound-like rendering only. Do not include real patient data, clinical images, protected health information, or claims of diagnostic accuracy.

## User-Facing Features

- Full-screen 3D simulator with a translucent torso or phantom centered near the world origin.
- Simplified synthetic internal organs represented with clean 3D primitives.
- Virtual ultrasound probe that can be translated and rotated with keyboard controls and mouse transform controls.
- Semi-transparent imaging plane attached to the probe.
- Procedural ultrasound-like texture generated from the imaging plane's intersection with the synthetic organ model.
- Live updates when probe position, orientation, imaging depth, gain, or opacity changes.
- UI readouts for probe position, yaw, pitch, roll, imaging depth, gain, opacity, and orientation.
- Comparison panel showing the correct in-situ orientation beside a deliberately wrong mirrored or rotated orientation.
- README and screenshot support suitable for a portfolio, PhD application, or CV project page.

## Architecture

- `src/app/`: top-level application composition and providers.
- `src/components/scene/`: Three.js and React Three Fiber scene components, including phantom, organs, probe, imaging plane, controls, and lighting.
- `src/components/ui/`: simulator controls, readouts, panels, legends, and disclaimers.
- `src/domain/`: domain math, coordinate definitions, synthetic anatomy descriptors, probe state, and ultrasound texture generation logic.
- `src/hooks/`: React hooks that connect controls, animation frames, and shared state.
- `src/lib/`: small framework-agnostic helpers.
- `src/styles/`: global styles and design tokens.
- `src/tests/`: Vitest unit tests for math, coordinates, probe transforms, and synthetic ultrasound behavior.

Shared simulator state should stay small and readable, with Zustand used for probe pose and imaging settings. Rendering components should prefer explicit props and simple data flow over clever abstractions.

## Simulator Coordinate System

Three.js world units represent approximate centimeters.

- X axis: patient left/right.
- Y axis: vertical/superior direction.
- Z axis: anterior/posterior depth.
- The torso is centered near the world origin.
- The probe sits above/anterior to the torso.
- The probe local `-Y` axis is the acoustic beam direction.
- The ultrasound imaging plane is attached to the probe.
- The imaging plane spans:
  - local `X` = transducer width.
  - local `-Y` = imaging depth.
  - local `Z` = slice thickness/normal direction.

This convention keeps the plane visually and mathematically consistent with the idea that the ultrasound slice physically emerges from the probe face into the phantom.

## Probe Coordinate System

The probe model should be authored so its face points along local `-Y`. Moving forward along local `-Y` means moving deeper along the acoustic beam. The imaging plane should be parented to the probe or derived from the same transform so translation and rotation are always synchronized.

Recommended display conventions:

- Position readouts use world centimeters.
- Orientation readouts use degrees.
- Yaw, pitch, and roll must be documented next to the implementation that computes them, because Three.js Euler order affects interpretation.
- Texture-space horizontal coordinates map to probe local `X`.
- Texture-space vertical coordinates map to increasing imaging depth along probe local `-Y`.

## Synthetic Ultrasound Algorithm

The ultrasound texture should be generated procedurally from synthetic scene data:

1. Sample points across the imaging plane in probe-local coordinates.
2. Transform each sample into world space.
3. Test the sample against simplified synthetic organ volumes.
4. Assign base echogenicity values for background, torso material, and each organ type.
5. Add ultrasound-like effects such as speckle noise, depth attenuation, gain scaling, edge enhancement, and mild scanline variation.
6. Write the resulting grayscale or lightly tinted values into a texture used by the imaging plane.

The algorithm should remain deterministic enough to test core math while still looking plausibly ultrasound-like. It must not ingest or imitate real patient scans.

## Definition Of Done

- `npm install` works.
- `npm run dev` starts the app.
- `npm run build` passes.
- `npm test` passes.
- The app opens to a polished full-screen simulator.
- The probe can be moved and rotated.
- The ultrasound plane follows the probe.
- The synthetic ultrasound texture visibly changes as the probe crosses different synthetic organs.
- The comparison panel clearly demonstrates correct in-situ orientation versus wrong mirrored or rotated orientation.
- README explains motivation, controls, architecture, and PhD/CV relevance.
- TypeScript remains strict and unbroken.
