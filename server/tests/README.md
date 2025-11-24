# Quiz Buzzer Test Suite

## Running the Simulation Test

The simulation test spawns 10 virtual WebSocket clients and tests the buzzer timing logic.

### Prerequisites
Make sure the server is running:
```bash
cd server
npm start
```

### Run the Test
In a new terminal:
```bash
cd server
node tests/simulation.js
```

### Expected Behavior
- 10 clients connect to the server
- A round is started via the REST API
- Client 1 buzzes at 100ms
- Client 2 buzzes at 101ms (1ms later)
- **Expected**: Client 1 receives order #1
- **Expected**: Client 2 is rejected (either "Already buzzed" or "Round not active" depending on auto-lock)

### Test Assertions
✅ Client 1 should be accepted with order #1  
✅ Client 2 should be rejected with a reason

The test will exit with code 0 on success, 1 on failure.
