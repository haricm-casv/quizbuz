# Change: Build Node.js Server

## Why
The core of the quiz system relies on a central server to manage state and ensure fair buzzer timing. Without this server, the PWA clients cannot communicate or synchronize the game state.

## What Changes
- Create a new Node.js project in `server/`.
- Implement WebSocket server using `ws`.
- Implement REST API using `express`.
- Implement in-memory state management for clients and quiz rounds.

## Impact
- Affected specs: `server-core`, `quiz-logic`, `api-control`
- Affected code: `server/` directory
