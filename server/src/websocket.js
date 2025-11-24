const WebSocket = require('ws');
const logger = require('./utils/logger');
const clientManager = require('./client-manager');
const quizManager = require('./quiz-manager');

function initializeWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        logger.info('New WebSocket connection');
        let currentClientId = null;

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleMessage(ws, data, (id) => currentClientId = id);
            } catch (err) {
                logger.error('Failed to parse message', err);
            }
        });

        ws.on('close', () => {
            if (currentClientId) {
                logger.info(`Connection closed for client ${currentClientId}`);
            }
        });

        ws.on('error', (err) => {
            logger.error('WebSocket error', err);
        });
    });

    startLatencyCheck();

    return wss;
}

function handleMessage(ws, data, setClientId) {
    switch (data.type) {
        case 'REGISTER':
            const client = clientManager.registerClient(ws, data.payload.teamName);
            setClientId(client.id);
            ws.send(JSON.stringify({
                type: 'REGISTERED',
                payload: {
                    clientId: client.id,
                    teamName: client.teamName,
                    serverTime: Date.now()
                }
            }));

            const state = quizManager.getState();
            ws.send(JSON.stringify({
                type: 'ROUND_STATE',
                payload: {
                    state: state.state,
                    roundId: state.roundId,
                    canBuzz: state.state === 'ACTIVE'
                }
            }));
            break;

        case 'BUZZER_PRESS':
            if (data.payload && data.payload.clientId) {
                const result = quizManager.handleBuzzer(
                    data.payload.clientId,
                    data.payload.clientTimestamp
                );

                if (!result.accepted) {
                    ws.send(JSON.stringify({
                        type: 'BUZZER_REJECTED',
                        payload: { reason: result.reason }
                    }));
                }
            }
            break;

        case 'PING':
            if (data.payload && data.payload.clientId) {
                clientManager.updateHeartbeat(data.payload.clientId);
                ws.send(JSON.stringify({ type: 'PONG' }));
            }
            break;

        case 'PONG':
            if (data.payload && data.payload.serverTimestamp && data.payload.clientId) {
                const now = Date.now();
                const rtt = now - data.payload.serverTimestamp;
                clientManager.updateRtt(data.payload.clientId, rtt);
            }
            break;

        default:
            logger.warn('Unknown message type', data.type);
    }
}

function startLatencyCheck() {
    setInterval(() => {
        const now = Date.now();
        for (const [clientId, client] of clientManager.clients) {
            if (client.socketConnection.readyState === WebSocket.OPEN) {
                client.socketConnection.send(JSON.stringify({
                    type: 'PING',
                    payload: {
                        serverTimestamp: now,
                        clientId: clientId
                    }
                }));
            }
        }
    }, 5000);
}

module.exports = { initializeWebSocketServer };
