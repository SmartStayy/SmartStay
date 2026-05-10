require('dotenv').config();
const express = require('express');
const config = require('config');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = config.get('server.port');

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

const pageRoutes = require('./routes/pages');
app.use('/', pageRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const apartmentRoutes = require('./routes/apartments');
app.use('/api/apartments', apartmentRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});

module.exports = app;