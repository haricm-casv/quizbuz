## ADDED Requirements

### Requirement: Buzzer Interface
The client MUST provide a large, responsive buzzer button.

#### Scenario: Buzzer Press
- **WHEN** the user taps the buzzer button in READY state
- **THEN** the client sends a BUZZER_PRESS message immediately
- **AND** triggers haptic feedback

### Requirement: Visual Feedback
The client MUST provide visual feedback for all states.

#### Scenario: Locked State
- **WHEN** the round is LOCKED
- **THEN** the buzzer button becomes red and disabled

### Requirement: Settings Panel
The client MUST provide a settings panel.

#### Scenario: Change Settings
- **WHEN** the user opens settings
- **THEN** they can modify Server IP and Team Name
