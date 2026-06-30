# Agent Instructions

This repository contains the AR-Style Ultrasound Slice Visualization Simulator, a static browser-only educational visualization project.

## Working Rules

- Use TypeScript strictly.
- Do not add real patient data, real clinical ultrasound images, protected health information, or diagnostic claims.
- Keep the app static and browser-only. Do not add a backend, database, authentication, or server-side runtime unless the project direction explicitly changes.
- Run `npm run build` and `npm test` after major changes.
- Prefer simple, readable components over clever abstractions.
- Do not stop with broken TypeScript.
- Keep domain math and coordinate conventions centralized in `src/domain/`.
- Preserve the educational non-medical disclaimer in user-facing documentation.

## Implementation Preferences

- Use React, TypeScript, Vite, Three.js, `@react-three/fiber`, `@react-three/drei`, Zustand, and Vitest.
- Keep synthetic anatomy and ultrasound rendering procedural and clearly labeled as synthetic.
- Keep scene units consistent with `PROJECT_SPEC.md`: Three.js world units approximate centimeters.
- Keep the probe local `-Y` axis as the acoustic beam direction.
- Add focused tests for coordinate math, probe transforms, and ultrasound sampling as those features are implemented.
