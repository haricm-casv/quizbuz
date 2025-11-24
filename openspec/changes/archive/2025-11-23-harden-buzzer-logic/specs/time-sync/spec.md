## ADDED Requirements

### Requirement: Latency Monitoring
The system MUST monitor network latency for each connected client.

#### Scenario: Calculate RTT
- **WHEN** the server sends a PING
- **AND** receives a PONG from the client
- **THEN** it calculates the Round Trip Time (RTT)
- **AND** stores it in the client session

### Requirement: Timestamp Analysis
The system MUST analyze the difference between client and server timestamps for buzzer presses.

#### Scenario: Record Transmission Time
- **WHEN** a BUZZER_PRESS is received
- **THEN** the server calculates the difference between Server Receipt Time and Client Send Time
- **AND** logs this as `transmissionLatency`
