const config = require('../config.json');
const logger = require('./utils/logger');
const { getHighResTimestamp, formatDuration } = require('./utils/timestamp');
const clientManager = require('./client-manager');

const ROUND_STATES = {
    IDLE: 'IDLE',
    READY: 'READY',
    ACTIVE: 'ACTIVE',
    LOCKED: 'LOCKED',
    RESULTS: 'RESULTS'
};

class QuizManager {
    constructor() {
        this.roundId = 0;
        this.state = ROUND_STATES.IDLE;
        this.startTime = null;
        this.buzzerPresses = [];
        this.roundHistory = [];
    }

    startRound() {
        this.roundId++;
        this.state = ROUND_STATES.ACTIVE;
        this.startTime = getHighResTimestamp();
        this.buzzerPresses = [];

        logger.info(`Round ${this.roundId} STARTED`);

        clientManager.broadcast({
            type: 'ROUND_STATE',
            payload: {
                state: this.state,
                roundId: this.roundId,
                canBuzz: true
            }
        });
    }

    resetRound() {
        this.state = ROUND_STATES.IDLE;
        this.buzzerPresses = [];
        this.startTime = null;

        logger.info(`Round ${this.roundId} RESET`);

        clientManager.broadcast({
            type: 'ROUND_STATE',
            payload: {
                state: this.state,
                roundId: this.roundId,
                canBuzz: false
            }
        });
    }

    lockRound() {
        this.state = ROUND_STATES.LOCKED;
        logger.info(`Round ${this.roundId} LOCKED`);

        clientManager.broadcast({
            type: 'ROUND_STATE',
            payload: {
                state: this.state,
                roundId: this.roundId,
                canBuzz: false
            }
        });

        this.broadcastResults();
    }

    handleBuzzer(clientId, clientTimestamp) {
        if (this.state !== ROUND_STATES.ACTIVE) {
            logger.warn(`Rejected buzz from ${clientId}: Round not ACTIVE (State: ${this.state})`);
            return { accepted: false, reason: 'Round not active' };
        }

        const client = clientManager.getClient(clientId);
        if (!client) return { accepted: false, reason: 'Client not found' };

        if (this.buzzerPresses.find(p => p.clientId === clientId)) {
            logger.warn(`Rejected buzz from ${client.teamName}: Duplicate press`);
            return { accepted: false, reason: 'Already buzzed' };
        }

        const serverTimestamp = getHighResTimestamp();
        const order = this.buzzerPresses.length + 1;

        let transmissionTime = 'N/A';
        if (clientTimestamp) {
            const serverTimeMs = Date.now();
            const diff = serverTimeMs - clientTimestamp;
            transmissionTime = `${diff}ms`;
        }

        const press = {
            clientId,
            teamName: client.teamName,
            timestamp: serverTimestamp,
            order
        };

        this.buzzerPresses.push(press);

        // Log nanosecond difference from previous buzz
        if (order > 1) {
            const prevPress = this.buzzerPresses[order - 2];
            const nsDiff = serverTimestamp - prevPress.timestamp;
            logger.info(`Buzzer: ${client.teamName} (#${order}) - Transmission: ${transmissionTime} - Δ from prev: ${nsDiff}ns`);
        } else {
            logger.info(`Buzzer: ${client.teamName} (#${order}) - Transmission: ${transmissionTime}`);
        }

        if (client.socketConnection.readyState === 1) {
            client.socketConnection.send(JSON.stringify({
                type: 'BUZZER_ACK',
                payload: {
                    clientId,
                    order,
                    totalPresses: this.buzzerPresses.length,
                    serverTimestamp: serverTimestamp.toString(),
                    transmissionTime
                }
            }));
        }

        if (this.buzzerPresses.length >= config.quiz.maxBuzzersPerRound) {
            this.lockRound();
        }

        return { accepted: true, order };
    }

    broadcastResults() {
        const results = this.buzzerPresses.map(p => ({
            teamName: p.teamName,
            order: p.order,
            time: this.startTime ? formatDuration(this.startTime, p.timestamp) : 'N/A'
        }));

        clientManager.broadcast({
            type: 'ROUND_RESULTS',
            payload: {
                buzzerOrder: results
            }
        });
    }

    getState() {
        return {
            roundId: this.roundId,
            state: this.state,
            pressCount: this.buzzerPresses.length
        };
    }
}

module.exports = new QuizManager();
