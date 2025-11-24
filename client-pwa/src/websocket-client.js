class WebSocketClient {
    constructor() {
        this.ws = null;
        this.url = null;
        this.reconnectAttempts = 0;
        this.maxReconnectDelay = 8000;
        this.listeners = {};
    }

    connect(ip, port = 3000) {
        this.url = `ws://${ip}:${port}`;
        this._connect();
    }

    _connect() {
        try {
            this.ws = new WebSocket(this.url);
            this.emit('connecting');

            this.ws.onopen = () => {
                console.log('Connected to server');
                this.reconnectAttempts = 0;
                this.emit('connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'PING') {
                        this.send('PONG', {
                            serverTimestamp: data.payload.serverTimestamp,
                            clientId: data.payload.clientId
                        });
                    } else {
                        this.emit('message', data);
                    }
                } catch (e) {
                    console.error('Failed to parse message', e);
                }
            };

            this.ws.onclose = () => {
                console.log('Connection closed');
                this.emit('disconnected');
                this._reconnect();
            };

            this.ws.onerror = (err) => {
                console.error('WebSocket error', err);
                this.ws.close();
            };

        } catch (e) {
            console.error('Connection failed', e);
            this._reconnect();
        }
    }

    _reconnect() {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
        console.log(`Reconnecting in ${delay}ms...`);

        setTimeout(() => {
            this.reconnectAttempts++;
            this._connect();
        }, delay);
    }

    send(type, payload = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}

// Export as global for simplicity in vanilla JS
window.wsClient = new WebSocketClient();
