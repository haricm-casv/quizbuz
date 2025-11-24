const express = require('express');
const http = require('http');
const cors = require('cors');
const os = require('os');
const path = require('path');
const qrcode = require('qrcode-terminal');
const config = require('../config.json');
const logger = require('./utils/logger');
const { initializeWebSocketServer } = require('./websocket');
const apiRoutes = require('./routes');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Serve PWA static files
const pwaPath = path.join(__dirname, '../../client-pwa/public');
app.use(express.static(pwaPath));

// API Routes
app.use('/api', apiRoutes);

// WebSocket Server
initializeWebSocketServer(server);

// Get Local IP
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Start Server
const PORT = config.server.wsPort || 3000;
server.listen(PORT, () => {
    const ip = getLocalIp();
    const pwaUrl = `http://${ip}:${PORT}`;

    logger.info(`Server started on port ${PORT}`);
    logger.info(`PWA URL: ${pwaUrl}`);
    logger.info(`WebSocket URL: ws://${ip}:${PORT}`);
    logger.info(`API URL: http://${ip}:${PORT}/api`);

    console.log(`
  ╔══════════════════════════════════════════════════╗
  ║      LOCAL QUIZ BUZZER SYSTEM - SERVER          ║
  ║  Server IP: ${ip.padEnd(28)}║
  ║  PWA URL: ${pwaUrl.padEnd(31)}║
  ╚══════════════════════════════════════════════════╝
  
  📱 Scan this QR code with your Android phone:
  `);

    // Generate QR code
    qrcode.generate(pwaUrl, { small: true });

    console.log(`
  ℹ️  Instructions:
     1. Open your phone camera or QR scanner app
     2. Scan the QR code above
     3. Open the link to install the PWA
     4. Enter your team name and connect!
  `);
});
