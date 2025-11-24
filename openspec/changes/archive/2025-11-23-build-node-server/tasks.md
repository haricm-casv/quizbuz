# Tasks: Build Node.js Server

1.  Initialize Server Project <!-- id: 0 -->
    - Create `server/` directory structure.
    - Initialize `package.json` and install dependencies (`ws`, `express`, `cors`, `dotenv`, `uuid`).
    - Create `config.json` with default settings.
    - Validation: `npm install` runs successfully.

2.  Implement Core Server & Utilities <!-- id: 1 -->
    - Create `src/utils/logger.js` and `src/utils/timestamp.js`.
    - Create `src/index.js` to set up Express and HTTP server.
    - Validation: Server starts and logs IP address.

3.  Implement Client Manager <!-- id: 2 -->
    - Create `src/client-manager.js`.
    - Implement methods to add, remove, and get clients.
    - Validation: Unit tests for adding/removing clients.

4.  Implement WebSocket Logic <!-- id: 3 -->
    - Create `src/websocket.js`.
    - Handle `REGISTER`, `BUZZER_PRESS`, `PING` messages.
    - Implement heartbeat loop.
    - Validation: Connect a WS client and verify registration.

5.  Implement Quiz Manager <!-- id: 4 -->
    - Create `src/quiz-manager.js`.
    - Implement state machine (IDLE, ACTIVE, etc.).
    - Handle buzzer presses with high-res timestamps.
    - Validation: Simulate a round and verify state transitions.

6.  Implement REST API <!-- id: 5 -->
    - Create `src/routes.js`.
    - Connect endpoints (`/api/round/start`, etc.) to `quiz-manager`.
    - Validation: Curl request to start round works.
