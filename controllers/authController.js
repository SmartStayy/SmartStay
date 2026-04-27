const path = require('path');
const bcrypt = require('bcrypt');
const config = require('config');

const dbConfig = config.get('db');
const User = require('../model/userModel'); 

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
};

exports.getRegisterPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
};

exports.loginUser = async (req, res) => {
    const { email, pass } = req.body;
    let response = { success: false, message: '' };

    try {
        const user = await User.findByEmail(email);

        if (user && await bcrypt.compare(pass, user.password)) {
            response.success = true;
            response.message = 'Вхід успішний!';
        } else {
            response.message = 'Невірний email або пароль!';
        }
    } catch (error) {
        console.error('Ошибка БД:', error);
        response.message = 'Помилка сервера при вході';
    } 
    
    res.json(response);
};

exports.registerUser = async (req, res) => {
    const { name, email, password, age } = req.body;
    let response = { success: false, message: '' };

    try {
        const existingUser = await User.findByEmail(email);

        if (existingUser) {
            response.message = "Цей email вже зареєстрований!";
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const result = await User.create(name, age, email, hashedPassword);

            if (result.insertId) {
                response.success = true;
                response.message = "Реєстрація успішна!";
            }
        }
    } catch (error) {
        console.error(error);
        response.message = "Помилка сервера при реєстрації";
    }
    
    res.json(response);
};