require('dotenv').config();
const express = require('express');
const config = require('config');
const path = require('path');
const app = express();

const PORT = config.get('server.port');

app.use(express.json());
app.use(express.static('public'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/search.html')); 
});

app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
