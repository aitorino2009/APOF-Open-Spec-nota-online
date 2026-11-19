# Spec Delta

## Purpose

Provides a mobile-optimized interface for student participants to submit numeric grades (0-10) and feedback for presentations.

## ADDED Requirements

### Requirement: Participant Identity Enforcement
The system SHALL request voter identity when required by the session configuration, or allow immediate voting when anonymous mode is active.

#### Scenario: Submitting with required identification
- **WHEN** a participant joins an identified session without entering a name
- **THEN** the system prevents vote submission until a non-empty name is provided

#### Scenario: Submitting in anonymous mode
- **WHEN** a participant joins an anonymous session
- **THEN** the system displays the voting form without requiring personal identification

### Requirement: Numeric Grade Submission (0-10)
The system SHALL allow participants to select and submit a numeric grade ranging between 0 and 10 in steps of 0.5 or integers.

#### Scenario: Valid grade selection
- **WHEN** the participant selects a score of 8.5 out of 10 and taps submit
- **THEN** the vote is recorded and the participant receives immediate visual confirmation of receipt

#### Scenario: Out of range grade prevention
- **WHEN** a client attempts to submit a grade outside the 0 to 10 boundary
- **THEN** the submission is rejected with an error message

### Requirement: Qualitative Feedback Comment
The system SHALL provide an optional text field where voters can leave constructive feedback and notes alongside their numerical score.

#### Scenario: Submitting with optional feedback
- **WHEN** a participant inputs text comments into the feedback area and submits
- **THEN** the comment is stored alongside the numerical grade

### Requirement: Single Vote Enforcement
The system SHALL prevent a single participant device from casting multiple votes for the same presentation session.

#### Scenario: Attempting duplicate vote
- **WHEN** a voter who has already submitted a score attempts to submit again
- **THEN** the system displays an indicator that their vote was already counted and prevents resubmission
