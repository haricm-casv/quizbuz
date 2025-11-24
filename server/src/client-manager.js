const { v4: uuidv4 } = require('uuid');
const logger = require('./utils/logger');

class ClientManager {
    constructor() {
        this.clients = new Map(); // Map<uuid, ClientSession>
    }

    registerClient(ws, teamName) {
        const clientId = uuidv4();
        const client = {
            id: clientId,
            teamName: teamName,
            socketConnection: ws,
            connectedAt: Date.now(),
            lastHeartbeat: Date.now(),
            rtt: 0,
            isActive: true
        };

        this.clients.set(clientId, client);
        logger.info(`Client registered: ${teamName} (${clientId})`);
        return client;
    }

    getClient(clientId) {
        return this.clients.get(clientId);
    }

    removeClient(clientId) {
        if (this.clients.has(clientId)) {
            const client = this.clients.get(clientId);
            logger.info(`Removing client: ${client.teamName} (${clientId})`);
            this.clients.delete(clientId);
        }
    }

    updateHeartbeat(clientId) {
        const client = this.clients.get(clientId);
        if (client) {
            client.lastHeartbeat = Date.now();
            client.isActive = true;
        }
    }

    updateRtt(clientId, rtt) {
        const client = this.clients.get(clientId);
        if (client) {
            client.rtt = rtt;
        }
    }

    getAllClients() {
        return Array.from(this.clients.values()).map(c => ({
            id: c.id,
            teamName: c.teamName,
            connectedAt: c.connectedAt,
            rtt: c.rtt,
            isActive: c.isActive
        }));
    }

    broadcast(message) {
        const data = JSON.stringify(message);
        for (const client of this.clients.values()) {
            if (client.socketConnection.readyState === 1) { // OPEN
                client.socketConnection.send(data);
            }
        }
    }
}

module.exports = new ClientManager();
