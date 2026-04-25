const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 80;

app.use(express.json());
app.use(express.static('public'));

// РАБОТА С БАЗОЙ ДАННЫХ 

const dbConfig = {
    host: 'MySQL-8.0',
    user: 'root',
    password: '', 
    database: 'booking_db' 
};


// ЛОГИН

app.post('/login', async (req, res) => {
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
            writeLog(`LOGIN SUCCESS: Email: ${email}`);
        } else {
            response.message = 'Невірний email або пароль!';
            writeLog(`LOGIN DECLINED: Email: ${email}`);
        }

    } catch (error) {
        console.error('Ошибка БД:', error);
        response.message = 'Помилка бази даних: ' + error.message;
    } finally {
        if (connection) await connection.end();
        res.json(response);
    }
});

// РЕГИСТРАЦИЯ

app.post('/register', async (req, res) => {
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
            writeLog(`REGISTER DECLINED: Email: ${email} (Already exists)`);
        } else {
            const [result] = await connection.execute(
                'INSERT INTO users (name, age, email, password) VALUES (?, ?, ?, ?)',
                [name, age || 0, email, password]
            );

            if (result.insertId) {
                response.success = true;
                response.message = "Реєстрація успішна!";
                writeLog(`REGISTER SUCCESS: Email: ${email}`);
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


// РАБОТА С БАЗОЙ ДАННЫХ



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
