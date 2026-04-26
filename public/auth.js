const express = require('express');
const path = require('path');
const router = express.Router();

const dbConfig = {
    host: 'MySQL-8.0',
    user: 'root',
    password: '', 
    database: 'booking_db' 
};

// Маршрути для логіна

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

router.post('/login', async (req, res) => {

    const { email, pass } = req.body;
    
    let response = { success: false, message: '' };
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        const user = rows[0];

        if (user && user.password === pass) {
            response.success = true;
            response.message = 'Вхід успішний!';
        } else {
            response.message = 'Невірний email або пароль!';
        }

    } catch (error) {
        console.error('Ошибка БД:', error);
        response.message = 'Помилка бази даних: ' + error.message;
    } finally {
        if (connection) await connection.end();
        res.json(response);
    }
});

// Маршрути для регістрації

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

router.post('/register', async (req, res) => {
    const { name, email, password, age } = req.body;
    let response = { success: false, message: '' };
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const [existingUsers] = await connection.execute(
            'SELECT id FROM users WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            response.message = "Цей email вже зареєстрований!";
        } else {
            const [result] = await connection.execute(
                'INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)',
                [name, age || 0, email, password]
            );

            if (result.insertId) {
                response.success = true;
                response.message = "Реєстрація успішна!";
            }
        }

    } catch (error) {
        console.error(error);
        response.message = "Помилка бази даних: " + error.message;

    } finally {
        if (connection) await connection.end();
        res.json(response);
    }
});

module.exports = router;