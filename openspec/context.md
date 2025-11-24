# Technical Context

## Technical Constraints & Assumptions

### Constraints
- **No Internet Required**: Entire system operates on LAN.
- **No External Services**: No cloud dependencies (Firebase, Pusher, etc.).
- **Minimal Setup**: No complex router configuration (uses default DHCP).
- **Cross-Platform Server**: Must run on Windows/Mac/Linux.
- **Mobile-First Client**: PWA optimized for Android Chrome (primary target).

### Assumptions
- All devices connected to same Wi-Fi network.
- Server laptop has static/reserved DHCP IP (recommended).
- Participants have modern browsers (Chrome 90+, Safari 14+).
- WebSocket support available (`ws://`, not `wss://` required).
- Maximum 10 concurrent clients (scalable to 50 with optimization).

## Technology Stack

### Server Application (Node.js)
- **Runtime**: Node.js >= 18.x LTS
- **Dependencies**:
  - `ws`: ^8.x
  - `express`: ^4.x
  - `cors`: ^2.x
  - `dotenv`: ^16.x
  - `uuid`: ^9.x

### Client Application (PWA)
- **Framework**: Vanilla JavaScript (or React/Vue if preferred)
- **Styling**: Material Design CSS / Tailwind CSS
- **Offline**: Service Worker for offline capability
- **Manifest**: Web App Manifest for installability
