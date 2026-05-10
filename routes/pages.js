const express = require('express');
const path = require('path');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const publicPath = path.join(__dirname, '..', 'public');

// Маршрути GET

router.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

router.get('/home', (req, res) => {
    res.redirect('/');
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(publicPath, 'login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(publicPath, 'register.html'));
});

router.get('/search', verifyToken, (req, res) => {
    res.sendFile(path.join(publicPath, 'search.html')); 
});

// router.get('/results',verifyToken, (req, res) => {
//     res.sendFile(path.join(publicPath, 'results.html')); 
// });

router.get('/apartment', (req, res) => {
    res.sendFile(path.join(publicPath, 'details.html'));
});

router.get('/profile', verifyToken, (req, res) => {
    res.sendFile(path.join(publicPath, 'profile.html'));
});

module.exports = router;