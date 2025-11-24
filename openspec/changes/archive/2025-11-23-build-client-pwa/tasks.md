# Tasks: Build Client PWA

1.  Initialize Client Project <!-- id: 0 -->
    - Create `client-pwa/` structure (`public/`, `src/`).
    - Create `index.html` with basic layout.
    - Create `manifest.json` and icons.
    - Validation: Page loads and is installable.

2.  Implement Core Logic <!-- id: 1 -->
    - Create `src/websocket-client.js`.
    - Implement connection handling and auto-reconnect.
    - Implement `app.js` state machine.
    - Validation: Client connects to server and handles state changes.

3.  Implement UI & Styling <!-- id: 2 -->
    - Create `styles.css` with CSS variables and responsive design.
    - Create `src/ui.js` for DOM manipulation.
    - Implement Buzzer button with ripple effect.
    - Validation: UI matches design spec and responds to state.

4.  Implement Buzzer Features <!-- id: 3 -->
    - Add touch event listeners for low latency.
    - Implement haptic feedback (Vibration API).
    - Implement Wake Lock API.
    - Validation: Pressing buzzer sends message and vibrates.

5.  Service Worker & Polish <!-- id: 4 -->
    - Create `sw.js` for caching assets.
    - Add settings panel (Server IP, Team Name).
    - Validation: App works offline (UI loads) and settings persist.
