# Design

## Context

See `proposal.md` for the motivation and scope. This is a greenfield project intended for classroom evaluations. The system must run smoothly on standard classroom hardware (laptop/projector) and student mobile devices across varying mobile operating systems and network connections without requiring app store installation.

## Goals / Non-Goals

**Goals:**
- Provide a responsive Web App with two primary views: Projector/Host View and Mobile Voter View.
- Instant access via QR code containing the direct session URL with prefilled session PIN.
- Blind voting synchronization: hide individual scores and running averages until the host ends the vote.
- Clean visual components: 0-10 rating controls, live vote counter, histogram distribution of scores, and comment wall.
- CSV data export for record keeping and gradebook integration.

**Non-Goals:**
- Heavy enterprise user accounts or mandatory social logins for students.
- Complex multi-criteria rubrics for this initial phase (sticking to the 0-10 single score + comment specification).
- Native iOS/Android app store packages (PWA/Responsive Web satisfies all requirements).

## Decisions

### 1. Technology Stack: React + Vite + Tailwind CSS
- **Rationale**: Fast build times, lightweight bundle, excellent mobile component ecosystem, and rapid responsiveness styling using Tailwind CSS.
- **Alternatives considered**: 
  - Pure HTML/JS: lacks scalable state management for real-time reactivity.
  - Flutter/React Native: creates adoption friction in class due to app downloads.

### 2. State & Data Synchronization Architecture
- **Rationale**: The app will use a clean service layer pattern (`SessionService`) supporting real-time data sync (via Firebase Realtime/Firestore or WebSocket backend, with a fallback local-storage/broadcast-channel mode for zero-config offline classroom testing).
- **Data Schema**:
  ```typescript
  interface Session {
    id: string;
    pin: string;
    title: string;
    groupName: string;
    isAnonymous: boolean;
    status: 'ACTIVE' | 'CLOSED';
    createdAt: number;
  }

  interface Vote {
    id: string;
    sessionId: string;
    voterId: string; // Device fingerprint / UUID
    voterName?: string;
    score: number; // 0.0 to 10.0
    comment?: string;
    timestamp: number;
  }
  ```

### 3. QR Code & Session Join Mechanism
- **Rationale**: Utilizing `qrcode.react` (SVG mode) for responsive scaling on high-resolution projector screens. The QR encodes the direct link: `https://<host>/join?session=<sessionId>&pin=<pin>` ensuring single-tap entry.

### 4. Preventing Ballot Stuffing
- **Rationale**: Voter devices will generate a unique client UUID stored in `localStorage`. The submission checks against existing submissions for that session, preventing duplicate votes while preserving anonymity when configured.

## Risks / Trade-offs

- **[Classroom Wi-Fi latency / cellular dropouts]** → Optimistic UI updates with receipt acknowledgments and client-side retry for vote submissions.
- **[Display readability on long-throw classroom projectors]** → High-contrast presentation theme with large typography and bold numerical badges.
- **[Host browser refresh during presentation]** → Session state persisted in storage so state is recovered automatically upon page refresh.
