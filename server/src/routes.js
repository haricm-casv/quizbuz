const express = require('express');
const router = express.Router();
const quizManager = require('./quiz-manager');
const clientManager = require('./client-manager');
const config = require('../config.json');

// Round Control
router.post('/round/start', (req, res) => {
    quizManager.startRound();
    res.json({ message: 'Round started', state: quizManager.getState() });
});

router.post('/round/lock', (req, res) => {
    quizManager.lockRound();
    res.json({ message: 'Round locked', state: quizManager.getState() });
});

router.post('/round/reset', (req, res) => {
    quizManager.resetRound();
    res.json({ message: 'Round reset', state: quizManager.getState() });
});

router.get('/round/status', (req, res) => {
    res.json(quizManager.getState());
});

// Client Management
router.get('/clients', (req, res) => {
    res.json(clientManager.getAllClients());
});

router.delete('/clients/:id', (req, res) => {
    clientManager.removeClient(req.params.id);
    res.json({ message: 'Client removed' });
});

// System
router.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

router.post('/settings', (req, res) => {
    // Simple in-memory update for now
    if (req.body.maxBuzzersPerRound) {
        config.quiz.maxBuzzersPerRound = req.body.maxBuzzersPerRound;
    }
    res.json({ message: 'Settings updated', config: config.quiz });
});

module.exports = router;
