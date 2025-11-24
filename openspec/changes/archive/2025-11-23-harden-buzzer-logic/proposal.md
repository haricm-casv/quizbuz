# Change: Harden Buzzer Logic and Time Sync

## Why
The current buzzer implementation is basic and relies solely on the server receiving the message. To ensure fairness and robustness, we need to explicitly handle network latency statistics, prevent early buzzing, and enforce strict ordering rules.

## What Changes
- Implement latency calculation (RTT) on connection and periodically.
- Update `BUZZER_PRESS` payload to include client timestamp for latency analysis.
- Enforce strict state checks (reject buzzes if not in `ACTIVE` state).
- Implement a "lockout" period to prevent buzzing immediately after a round starts (optional, but good for fairness).
- Add latency statistics to the `BUZZER_ACK` message.

## Impact
- Affected specs: `quiz-logic`, `time-sync`
- Affected code: `server/src/quiz-manager.js`, `server/src/websocket.js`, `client-pwa/src/websocket-client.js`
