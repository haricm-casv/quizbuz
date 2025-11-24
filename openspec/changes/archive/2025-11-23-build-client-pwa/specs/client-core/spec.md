## ADDED Requirements

### Requirement: Connection Management
The client MUST manage the WebSocket connection to the server.

#### Scenario: Connect to Server
- **WHEN** the user enters a Server IP and clicks Connect
- **THEN** the client establishes a WebSocket connection
- **AND** saves the IP to local storage

#### Scenario: Auto-Reconnect
- **WHEN** the connection is lost
- **THEN** the client attempts to reconnect with exponential backoff

### Requirement: Team Registration
The client MUST allow users to register a team name.

#### Scenario: Register Team
- **WHEN** the client connects
- **THEN** it sends a REGISTER message with the stored team name

### Requirement: State Management
The client MUST track the application state (DISCONNECTED, CONNECTED, READY, BUZZED, LOCKED).

#### Scenario: State Transition
- **WHEN** a ROUND_STATE message is received
- **THEN** the client updates its internal state
- **AND** updates the UI accordingly
