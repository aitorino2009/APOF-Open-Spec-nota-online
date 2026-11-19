# Spec Delta

## Purpose

Calculates, conceals during voting, and presents aggregated statistical scores and comments upon session completion.

## ADDED Requirements

### Requirement: Blind Voting Counter
The system SHALL conceal score metrics, grade averages, and individual votes while voting remains active, displaying only the count of received ballots.

#### Scenario: Real-time ballot count during voting
- **WHEN** incoming votes are registered while session status is active
- **THEN** the presenter view updates the total voter counter without revealing any score data

### Requirement: Aggregated Metrics Reveal
The system SHALL compute and display the final average score and score breakdown once the host closes voting.

#### Scenario: Revealing final grades upon session close
- **WHEN** the host triggers the end of voting
- **THEN** the screen displays the overall mean grade (0-10 scale), total votes cast, and a visual histogram distribution of scores

### Requirement: Feedback Wall
The system SHALL present qualitative feedback comments submitted by participants in a legible card-based or wall layout.

#### Scenario: Viewing feedback commentary
- **WHEN** results are revealed on a completed presentation
- **THEN** all submitted feedback comments are displayed, respecting the anonymity setting of the session

### Requirement: Results Export
The system SHALL allow the host to export session voting results, metrics, and individual ballots to CSV format.

#### Scenario: Exporting session data
- **WHEN** the host clicks the export CSV button on the results screen
- **THEN** a CSV file containing session metadata, mean score, and itemized records is downloaded
