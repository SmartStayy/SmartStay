const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const config = require('config');
const logAuthEvent = require('../utils/logger');

const dbConfig = config.get('db');
const User = require('../model/userModel'); 

exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    let response = { success: false, message: '' };

    try {
        const user = await User.findByEmail(email);

        if (user && await bcrypt.compare(pass, user.password)) {
            const token = jwt.sign({ id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1 * 60 * 60 * 1000 
            });
            response.success = true;
            response.message = 'Вхід успішний!';
            response.token = token;
            logAuthEvent('LOGIN_SUCCESS', email, ip, 'Успішна авторизація');

        } else {
            response.message = 'Невірний email або пароль!';
            const reason = !user ? 'Користувача не знайдено' : 'Невірний пароль';
            logAuthEvent('LOGIN_FAILED', email, ip, reason);
        }
    } catch (error) {
        console.error('Ошибка БД:', error);
        response.message = 'Помилка сервера при вході';
        logAuthEvent('(LOGIN) SERVER_ERROR', email, ip, 'Помилка БД: ' + error.message);
    } 
    
    res.json(response);
};

exports.registerUser = async (req, res) => {
    const { name, email, password, age } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    let response = { success: false, message: '' };

    try {

        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: 'Пароль має містити мінімум 8 символів' 
            });
        }

        const hasNumber = /\d/.test(password);
        if (!hasNumber) {
            return res.status(400).json({
                success: false,
                message: 'Пароль має містити хоча б одну цифру'
            });
        }

        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            response.message = "Цей email вже зареєстрований!";
            logAuthEvent('REGISTER_FAILED', email, ip, 'Спроба реєстрації з існуючим email');
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await User.create(name, age, email, hashedPassword);

            if (result.insertId) {

                const token = jwt.sign(
                    { id: result.insertId, email: email },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 1 * 60 * 60 * 1000
                });

                response.success = true;
                response.message = "Реєстрація успішна!";

                logAuthEvent('REGISTER_SUCCESS', email, ip, 'Успішна реєстрація');
            }
        }
    }
    catch (error) {
        console.error(error);
        response.message = "Помилка сервера при реєстрації";
        logAuthEvent('(REGISTER) SERVER_ERROR', email, ip, 'Помилка БД: ' + error.message);
    }
    
    res.json(response);
};