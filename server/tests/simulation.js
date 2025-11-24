/**
 * Test Simulation: 10 Virtual Clients with Precise Timing
 * 
 * This script spawns 10 WebSocket clients, starts a round,
 * and tests that buzzer ordering works correctly with millisecond precision.
 */

const WebSocket = require('ws');
const http = require('http');

const SERVER_URL = 'ws://localhost:3000';
const API_URL = 'http://localhost:3000';

class VirtualClient {
    constructor(id, teamName) {
        this.id = id;
        this.teamName = teamName;
        this.ws = null;
        this.clientId = null;
        this.buzzResult = null;
        this.connected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket(SERVER_URL);

            this.ws.on('open', () => {
                console.log(`[Client ${this.id}] Connected`);
                this.connected = true;

                // Register
                this.ws.send(JSON.stringify({
                    type: 'REGISTER',
                    payload: { teamName: this.teamName }
                }));
            });

            this.ws.on('message', (data) => {
                const message = JSON.parse(data);
                this.handleMessage(message, resolve);
            });

            this.ws.on('error', (err) => {
                console.error(`[Client ${this.id}] Error:`, err.message);
                reject(err);
            });

            this.ws.on('close', () => {
                console.log(`[Client ${this.id}] Disconnected`);
                this.connected = false;
            });
        });
    }

    handleMessage(message, resolveConnection) {
        switch (message.type) {
            case 'REGISTERED':
                this.clientId = message.payload.clientId;
                console.log(`[Client ${this.id}] Registered as ${this.clientId}`);
                if (resolveConnection) resolveConnection();
                break;

            case 'ROUND_STATE':
                console.log(`[Client ${this.id}] Round state: ${message.payload.state}`);
                break;

            case 'BUZZER_ACK':
                this.buzzResult = {
                    accepted: true,
                    order: message.payload.order,
                    timestamp: message.payload.serverTimestamp
                };
                console.log(`[Client ${this.id}] ✅ BUZZED! Order: #${message.payload.order}`);
                break;

            case 'BUZZER_REJECTED':
                this.buzzResult = {
                    accepted: false,
                    reason: message.payload.reason
                };
                console.log(`[Client ${this.id}] ❌ REJECTED: ${message.payload.reason}`);
                break;

            case 'PING':
                // Respond to server ping
                this.ws.send(JSON.stringify({
                    type: 'PONG',
                    payload: {
                        serverTimestamp: message.payload.serverTimestamp,
                        clientId: message.payload.clientId
                    }
                }));
                break;
        }
    }

    buzz() {
        if (!this.connected || !this.clientId) {
            console.error(`[Client ${this.id}] Cannot buzz - not connected or registered`);
            return;
        }

        this.ws.send(JSON.stringify({
            type: 'BUZZER_PRESS',
            payload: {
                clientId: this.clientId,
                clientTimestamp: Date.now()
            }
        }));
        console.log(`[Client ${this.id}] Sent BUZZER_PRESS`);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// API Helper Functions
function startRound() {
    return new Promise((resolve, reject) => {
        http.get(`${API_URL}/api/round/start`, { method: 'POST' }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log('📢 Round STARTED via API');
                resolve(JSON.parse(data));
            });
        }).on('error', reject);
    });
}

function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_URL);
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data ? JSON.parse(data) : {}));
        });

        req.on('error', reject);
        req.end();
    });
}

// Main Test
async function runSimulation() {
    console.log('🚀 Starting Simulation...\n');

    // Create 10 virtual clients
    const clients = [];
    for (let i = 1; i <= 10; i++) {
        clients.push(new VirtualClient(i, `Team ${i}`));
    }

    try {
        // Step 1: Connect all clients
        console.log('📡 Connecting clients...');
        await Promise.all(clients.map(c => c.connect()));
        console.log('✅ All clients connected\n');

        // Wait a bit for everything to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 2: Start the round via API
        console.log('🎮 Starting round...');
        await makeRequest('/api/round/start', 'POST');
        console.log('✅ Round started\n');

        // Wait for round state to propagate
        await new Promise(resolve => setTimeout(resolve, 200));

        // Step 3: Client 1 buzzes at 100ms
        console.log('⏱️  Scheduling buzzes...');
        setTimeout(() => {
            clients[0].buzz(); // Client 1 at 100ms
        }, 100);

        // Step 4: Client 2 buzzes at 101ms (1ms later)
        setTimeout(() => {
            clients[1].buzz(); // Client 2 at 101ms
        }, 101);

        // Wait for results
        await new Promise(resolve => setTimeout(resolve, 500));

        // Step 5: Assertions
        console.log('\n📊 Test Results:');
        console.log('─'.repeat(50));

        const client1Result = clients[0].buzzResult;
        const client2Result = clients[1].buzzResult;

        console.log(`Client 1 Result:`, client1Result);
        console.log(`Client 2 Result:`, client2Result);
        console.log('─'.repeat(50));

        // Assertions
        let passed = true;

        if (!client1Result || !client1Result.accepted) {
            console.error('❌ FAIL: Client 1 should have been accepted');
            passed = false;
        } else if (client1Result.order !== 1) {
            console.error(`❌ FAIL: Client 1 should be order #1, got #${client1Result.order}`);
            passed = false;
        } else {
            console.log('✅ PASS: Client 1 buzzed successfully and got order #1');
        }

        if (!client2Result || client2Result.accepted) {
            console.error('❌ FAIL: Client 2 should have been rejected or locked');
            passed = false;
        } else {
            console.log(`✅ PASS: Client 2 was rejected/locked (reason: ${client2Result.reason})`);
        }

        console.log('─'.repeat(50));

        if (passed) {
            console.log('🎉 ALL TESTS PASSED!');
        } else {
            console.log('💥 SOME TESTS FAILED!');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Simulation failed:', error);
        process.exit(1);
    } finally {
        // Cleanup
        console.log('\n🧹 Cleaning up...');
        clients.forEach(c => c.disconnect());

        setTimeout(() => {
            console.log('✅ Simulation complete');
            process.exit(0);
        }, 500);
    }
}

// Run if executed directly
if (require.main === module) {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  Quiz Buzzer - Simulation Test            ║');
    console.log('║  10 Virtual Clients, Precise Timing Test  ║');
    console.log('╚════════════════════════════════════════════╝\n');

    runSimulation().catch(err => {
        console.error('Fatal error:', err);
        process.exit(1);
    });
}

module.exports = { VirtualClient, runSimulation };
