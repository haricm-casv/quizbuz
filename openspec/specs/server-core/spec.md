# server-core Specification

## Purpose
TBD - created by archiving change build-node-server. Update Purpose after archive.
## Requirements
### Requirement: WebSocket Server
The system MUST run a WebSocket server on port 3000.

#### Scenario: Server Startup
- **WHEN** the server initializes
- **THEN** it should listen on port 3000

### Requirement: Client Registration
The system MUST allow clients to register with a team name.

#### Scenario: New Client Registration
- **WHEN** the client sends a REGISTER message
- **THEN** the server should generate a unique UUID

