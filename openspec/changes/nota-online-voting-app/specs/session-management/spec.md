# Spec Delta

## Purpose

Enables hosts to create, configure, project, and control live classroom presentation evaluation sessions.

## ADDED Requirements

### Requirement: Session Creation and Configuration
The system SHALL allow an evaluator/host to create a new session by specifying a presentation title, group name, and an identification mode (anonymous or identified with student names).

#### Scenario: Creating an anonymous presentation session
- **WHEN** the host enters the presentation title and selects anonymous voting mode
- **THEN** the system generates a unique session with a shareable PIN and QR code with anonymous voting enabled

#### Scenario: Creating an identified presentation session
- **WHEN** the host enters the presentation title and selects identified voting mode
- **THEN** the system requires voters to supply their full name before submitting grades for that session

### Requirement: QR Code and Direct Join Display
The system SHALL render a high-visibility presentation view showing a QR code and join URL for attendees to connect instantly from mobile devices.

#### Scenario: Displaying the session joining details
- **WHEN** the host opens the session presentation view
- **THEN** the screen displays the large scannable QR code, the direct link, and the alphanumeric session PIN

### Requirement: Session State Controls
The system SHALL provide the host with controls to open, pause, and close the voting period for the current presentation.

#### Scenario: Closing a voting session
- **WHEN** the host clicks to end voting
- **THEN** the session status transitions to closed, rejecting further submissions and triggering result aggregation
