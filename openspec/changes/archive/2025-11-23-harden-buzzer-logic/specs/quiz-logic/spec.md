## MODIFIED Requirements

### Requirement: Round State Management
The system MUST manage quiz round states and enforce strict transitions.

#### Scenario: Start Round
- **WHEN** Start Round is triggered
- **THEN** state changes to READY
- **AND** then automatically to ACTIVE after a short delay (if configured)

## ADDED Requirements

### Requirement: Strict Buzzer Validation
The system MUST validate every buzzer press against the current round state.

#### Scenario: Reject Early Buzz
- **WHEN** a buzzer press is received while state is READY (not ACTIVE)
- **THEN** the server MUST reject the press
- **AND** respond with an error reason "Too Early"

#### Scenario: Reject Duplicate Buzz
- **WHEN** a client presses the buzzer a second time in the same round
- **THEN** the server MUST reject the press
