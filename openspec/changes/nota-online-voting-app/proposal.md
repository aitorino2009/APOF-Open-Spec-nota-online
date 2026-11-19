# Proposal

## Why

In classroom environments, student oral presentations and project demonstrations require fast, engaging, and objective peer assessment. Current manual methods (paper slips, spreadsheets) are slow, disrupt the flow of class, and lack real-time engagement. This web application provides an instant, mobile-friendly voting experience inspired by PollUnit, allowing students to vote via QR code while projecting live progress and aggregated results without bias.

## What Changes

- Create a responsive Web Application optimized for both desktop/projector presentation and mobile voting.
- Introduce session management for teachers/hosts to configure assignments, toggling between anonymous and identified voting.
- Provide QR code generation and PIN for fast mobile entry without app store installations.
- Implement a 0-10 numerical grading system with optional qualitative feedback/comments.
- Maintain blind voting (hiding average grades and individual scores while voting is in progress) to avoid anchoring bias.
- Provide a summary dashboard when voting ends with average grade, grade distribution, feedback comments, and CSV export.

## Capabilities

### New Capabilities
- `session-management`: Host capability to create presentation evaluation sessions, configure identification rules (anonymous vs identified), open/close voting, and project session QR/PIN codes.
- `voting`: Mobile participant voting flow allowing students to submit a 0-10 score and optional written feedback once per session.
- `results-display`: Live aggregated visualization of votes, revealing the average grade, distribution breakdown, and qualitative feedback once voting concludes.

### Modified Capabilities
None (new greenfield project).

## Impact

- Greenfield application directory structure (`frontend/` and state/backend configuration).
- Dependencies: React, Vite, Tailwind CSS, Lucide icons, `qrcode.react`, and real-time state synchronization.
