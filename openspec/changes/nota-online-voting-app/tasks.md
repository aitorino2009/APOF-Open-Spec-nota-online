# Tasks

## 1. Project Scaffolding & Setup

- [ ] 1.1 Initialize the React + Vite + Tailwind CSS project structure and verify `npm run build` succeeds.
- [ ] 1.2 Install necessary dependencies (`lucide-react`, `qrcode.react`, `canvas-confetti`) and verify successful module resolution.

## 2. Core State & Data Service Layer

- [ ] 2.1 Define TypeScript models in `src/types/index.ts` for `Session`, `Vote`, and `SessionResults`, and verify TypeScript compilation passes.
- [ ] 2.2 Implement `src/services/sessionService.ts` providing session creation, vote recording, blind voter counts, and results calculations, verifying unit tests or simulation scripts pass.

## 3. Host / Presentation View

- [ ] 3.1 Create Host Dashboard with session creation modal supporting anonymous vs identified toggles, verifying created sessions appear in the host list.
- [ ] 3.2 Build the Projector/Presentation component showing full-screen scannable QR code, PIN, presentation title, and live blind vote counter, verifying correct QR link generation.
- [ ] 3.3 Implement the Results View displaying overall mean grade (0-10), vote distribution chart, feedback comments wall, and CSV export action, verifying metric calculations.

## 4. Mobile Participant Voting Experience

- [ ] 4.1 Build responsive Mobile Join view supporting direct QR link parameters and conditional voter name prompt, verifying name requirement for non-anonymous sessions.
- [ ] 4.2 Implement 0-10 grade selection slider/grid and optional feedback comment box with input validation, verifying valid and out-of-range boundaries.
- [ ] 4.3 Implement vote confirmation screen and duplicate vote prevention using device UUID storage, verifying a device cannot vote twice in the same session.

## 5. End-to-End Simulation & Verification

- [ ] 5.1 Execute end-to-end integration test simulating host session creation, multiple voter submissions, closing voting, and verifying accurate metrics display and CSV export.
