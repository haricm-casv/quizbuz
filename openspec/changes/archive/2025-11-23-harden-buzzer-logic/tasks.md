# Tasks: Harden Buzzer Logic

1.  Implement Latency Measurement <!-- id: 0 -->
    - Update `websocket.js` to handle `PING`/`PONG` with timestamps.
    - Calculate RTT (Round Trip Time) for each client.
    - Validation: Server logs show RTT for connected clients.

2.  Update Buzzer Protocol <!-- id: 1 -->
    - Update client to send `clientTimestamp` in `BUZZER_PRESS`.
    - Update server to calculate `transmissionTime` (ServerTime - ClientTime) for analysis.
    - Validation: Buzzer logs show transmission time.

3.  Harden Quiz Manager <!-- id: 2 -->
    - Add strict state check: Reject buzz if state is not `ACTIVE`.
    - Add duplicate check: Reject if client already buzzed in this round.
    - Validation: Unit tests for rejecting invalid buzzes.

4.  Client Feedback <!-- id: 3 -->
    - Update client UI to show "Too Early" or "Locked" if server rejects the buzz.
    - Validation: UI handles rejected buzzes gracefully.
