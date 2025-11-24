// App State
const state = {
    serverIp: localStorage.getItem('serverIp') || window.location.hostname || '',
    teamName: localStorage.getItem('teamName') || '',
    clientId: null,
    isConnected: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved settings or auto-detect from URL
    if (!state.serverIp && window.location.hostname && window.location.hostname !== 'localhost') {
        state.serverIp = window.location.hostname;
    }

    UI.elements.serverIpInput.value = state.serverIp;
    UI.elements.teamNameInput.value = state.teamName;
    UI.updateInfo(state.serverIp, state.teamName);

    // If settings exist, try to connect
    if (state.serverIp && state.teamName) {
        connectToServer();
    } else {
        UI.toggleSettings(true);
    }

    setupEventListeners();
});

function connectToServer() {
    if (!state.serverIp) return;

    UI.updateConnectionStatus('connecting');
    UI.setGameState('CONNECTING', 'Connecting to server...');

    window.wsClient.connect(state.serverIp);
}

function setupEventListeners() {
    // Settings
    UI.elements.settingsBtn.addEventListener('click', () => UI.toggleSettings(true));
    UI.elements.closeSettingsBtn.addEventListener('click', () => UI.toggleSettings(false));

    UI.elements.saveSettingsBtn.addEventListener('click', () => {
        const ip = UI.elements.serverIpInput.value.trim();
        const name = UI.elements.teamNameInput.value.trim();

        if (ip && name) {
            state.serverIp = ip;
            state.teamName = name;
            localStorage.setItem('serverIp', ip);
            localStorage.setItem('teamName', name);

            UI.updateInfo(ip, name);
            UI.toggleSettings(false);
            connectToServer();
        }
    });

    // Buzzer
    const buzzerBtn = UI.elements.buzzerBtn;
    const handleBuzz = (e) => {
        e.preventDefault();
        if (!buzzerBtn.disabled) {
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate(50);

            // Send buzz
            window.wsClient.send('BUZZER_PRESS', {
                clientId: state.clientId,
                clientTimestamp: Date.now()
            });

            // Optimistic UI update
            UI.setGameState('BUZZED', 'Buzzer Pressed!');
        }
    };

    buzzerBtn.addEventListener('touchstart', handleBuzz, { passive: false });
    buzzerBtn.addEventListener('mousedown', handleBuzz);

    // WebSocket Events
    window.wsClient.on('connected', () => {
        state.isConnected = true;
        UI.updateConnectionStatus('connected');
        UI.setGameState('CONNECTED', 'Connected! Registering...');

        // Register team
        window.wsClient.send('REGISTER', { teamName: state.teamName });
    });

    window.wsClient.on('disconnected', () => {
        state.isConnected = false;
        UI.updateConnectionStatus('disconnected');
        UI.setGameState('DISCONNECTED', 'Connection lost. Reconnecting...');
    });

    window.wsClient.on('message', (data) => {
        handleServerMessage(data);
    });
}

function handleServerMessage(data) {
    switch (data.type) {
        case 'REGISTERED':
            state.clientId = data.payload.clientId;
            UI.setGameState('IDLE', 'Waiting for round to start...');
            break;

        case 'ROUND_STATE':
            handleRoundState(data.payload);
            break;

        case 'BUZZER_ACK':
            if (data.payload.clientId === state.clientId) {
                UI.setGameState('BUZZED', `You are #${data.payload.order}!`);
                UI.showResult(data.payload.order, '...');
            } else {
                UI.setGameState('LOCKED', 'Locked!');
            }
            break;

        case 'BUZZER_REJECTED':
            UI.setGameState('LOCKED', `Rejected: ${data.payload.reason}`);
            break;

        case 'ROUND_RESULTS':
            const myResult = data.payload.buzzerOrder.find(r => r.teamName === state.teamName);
            if (myResult) {
                UI.showResult(myResult.order, myResult.time);
            }
            break;
    }
}

function handleRoundState(payload) {
    UI.hideResult();

    switch (payload.state) {
        case 'IDLE':
            UI.setGameState('IDLE', 'Waiting for round to start...');
            break;
        case 'READY':
        case 'ACTIVE':
            UI.setGameState('READY', 'GO! PRESS NOW!');
            break;
        case 'LOCKED':
            UI.setGameState('LOCKED', 'Round Locked');
            break;
        case 'RESULTS':
            UI.setGameState('LOCKED', 'Round Over');
            break;
    }
}
