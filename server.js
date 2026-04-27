require('dotenv').config();
const express = require('express');
const config = require('config');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

const PORT = config.get('server.port');

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

const authRoutes = require('./routes/auth');
const { verifyToken } = require('./middleware/authMiddleware');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search', verifyToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/search.html')); 
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/results.html')); 
});

app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
