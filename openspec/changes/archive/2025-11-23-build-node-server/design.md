# Design: Node.js Server Architecture

## Architecture
The server follows a modular architecture separating concerns into:
- **Network Layer**: `websocket.js` for real-time comms and `routes.js` for REST API.
- **Logic Layer**: `quiz-manager.js` for game state and `client-manager.js` for session tracking.
- **Core**: `index.js` as the entry point.

## State Management
In-memory state will be used for simplicity and speed, as per the "No External Services" constraint.
- **Client Registry**: A Map storing connected clients by UUID.
- **Round State**: An object tracking the current round status, start time, and buzzer presses.

## Timing & Precision
- Use `process.hrtime.bigint()` for recording buzzer timestamps on the server side to ensure microsecond precision and resolve race conditions.
- Buzzer order is determined solely by server receipt time.

## Error Handling
- **Disconnection**: Clients are marked as disconnected but kept in memory for a grace period (60s) to allow reconnection.
- **Race Conditions**: Handled by the single-threaded nature of Node.js event loop + high-res timestamps.
