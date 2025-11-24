const UI = {
    elements: {
        connectionStatus: document.getElementById('connection-status'),
        serverDisplay: document.getElementById('server-display'),
        teamDisplay: document.getElementById('team-display'),
        gameStatus: document.getElementById('game-status'),
        buzzerBtn: document.getElementById('buzzer-btn'),
        resultPanel: document.getElementById('result-panel'),
        resultOrder: document.getElementById('result-order'),
        resultTime: document.getElementById('result-time'),
        settingsModal: document.getElementById('settings-modal'),
        serverIpInput: document.getElementById('server-ip'),
        teamNameInput: document.getElementById('team-name'),
        saveSettingsBtn: document.getElementById('save-settings-btn'),
        closeSettingsBtn: document.getElementById('close-settings-btn'),
        settingsBtn: document.getElementById('settings-btn')
    },

    updateConnectionStatus(status) {
        const el = this.elements.connectionStatus;
        el.className = `status-indicator ${status}`;
    },

    updateInfo(serverIp, teamName) {
        this.elements.serverDisplay.textContent = serverIp || 'Not Connected';
        this.elements.teamDisplay.textContent = teamName || '--';
    },

    setGameState(state, message) {
        this.elements.gameStatus.textContent = message;
        const btn = this.elements.buzzerBtn;

        // Reset classes
        btn.className = 'buzzer';
        btn.disabled = true;

        switch (state) {
            case 'READY':
                btn.classList.add('ready');
                btn.disabled = false;
                btn.querySelector('.buzzer-text').textContent = 'BUZZ!';
                break;
            case 'BUZZED':
                btn.classList.add('buzzed');
                btn.querySelector('.buzzer-text').textContent = 'BUZZED!';
                break;
            case 'LOCKED':
                btn.classList.add('locked');
                btn.querySelector('.buzzer-text').textContent = 'LOCKED';
                break;
            default:
                btn.querySelector('.buzzer-text').textContent = 'WAITING...';
        }
    },

    showResult(order, time) {
        this.elements.resultPanel.classList.remove('hidden');
        this.elements.resultOrder.textContent = `#${order}`;
        this.elements.resultTime.textContent = time;
    },

    hideResult() {
        this.elements.resultPanel.classList.add('hidden');
    },

    toggleSettings(show) {
        if (show) {
            this.elements.settingsModal.classList.remove('hidden');
        } else {
            this.elements.settingsModal.classList.add('hidden');
        }
    }
};

window.UI = UI;
