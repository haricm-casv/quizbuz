# Project Context

## System Architecture

### Network Topology
The system operates on a Local Wi-Fi Network (No Internet).

- **Server**: Laptop running Node.js App. Acts as WebSocket host. IP: `192.168.x.x:3000`.
- **Clients**: Mobile phones running PWA. Connect via WebSocket.

### Diagram
```text
┌─────────────────────────────────────────────────────┐
│                  Local Wi-Fi Network                │
│                    (No Internet)                    │
│                                                     │
│  ┌──────────────┐                                  │
│  │   Laptop     │ ◄──── Server acts as             │
│  │   (Server)   │       WebSocket host             │
│  │ Node.js App  │       IP: 192.168.x.x:3000       │
│  └──────┬───────┘                                  │
│         │                                           │
│         │ WebSocket Connections                    │
│         │                                           │
│  ┌──────┴─────────────────────────────────────┐   │
│  │                                             │   │
│  ▼              ▼              ▼              ▼   │
│ ┌────┐       ┌────┐       ┌────┐       ┌────┐    │
│ │PWA │       │PWA │       │PWA │  ...  │PWA │    │
│ │ #1 │       │ #2 │       │ #3 │       │#10 │    │
│ └────┘       └────┘       └────┘       └────┘    │
│ Phone 1      Phone 2      Phone 3      Phone 10  │
└─────────────────────────────────────────────────────┘
```

## Communication Protocol

- **Primary**: WebSocket (`ws://`) for real-time bidirectional communication.
- **Fallback**: HTTP REST API for initial configuration and health checks.

### Port Configuration
- **WebSocket Server**: Port 3000
- **HTTP Control Panel**: Port 3001 (optional admin interface)

### WebSocket Message Protocol

#### Client → Server Messages
1.  **Register team**: `{ type: "REGISTER", payload: { teamName: "..." } }`
2.  **Buzzer press**: `{ type: "BUZZER_PRESS", payload: { clientId: "...", clientTimestamp: ... } }`
3.  **Heartbeat**: `{ type: "PING", payload: { clientId: "..." } }`

#### Server → Client Messages
1.  **Registration confirmation**: `{ type: "REGISTERED", payload: { ... } }`
2.  **Round state update**: `{ type: "ROUND_STATE", payload: { state: "ACTIVE", ... } }`
3.  **Buzzer acknowledgment**: `{ type: "BUZZER_ACK", payload: { order: 1, ... } }`
4.  **Round results**: `{ type: "ROUND_RESULTS", payload: { buzzerOrder: [...] } }`
5.  **Connection list update**: `{ type: "CLIENTS_UPDATE", payload: { connectedClients: [...] } }`
