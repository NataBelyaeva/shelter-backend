// src/controllers/auth.controller.js
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 1. ВХОД В СИСТЕМУ (SIGNIN)
// Получение токена для доступа к защищенным маршрутам

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден" });
        }

        // Сравниваем пароль, введенный пользователем, с хешем в базе
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Неправильный пароль"
            });
        }

        // Пароль верный: генерируем JWT
        const token = jwt.sign(
            { id: user.id }, 
            config.secret, 
            { expiresIn: 3600 } // 1 час
        );

        // Успех: отправляем токен и данные пользователя
        res.status(200).send({
            id: user.id,
            username: user.username,
            accessToken: token
        });

    } catch (error) {
        res.status(500).send({ message: error.message || "Ошибка входа" });
    }
};

// 2. РЕГИСТРАЦИЯ (СОЗДАНИЕ) НОВОГО ПОЛЬЗОВАТЕЛЯ
exports.signup = async (req, res) => {
    try {
        // Проверяем, не занято ли имя пользователя
        const userExists = await User.findOne({ where: { username: req.body.username } });
        if (userExists) {
            return res.status(400).send({ message: "Ошибка: Логин уже занят!" });
        }

        // Создаем пользователя в БД
        await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8) // Хешируем пароль
        });

        res.status(201).send({ message: "Пользователь успешно зарегистрирован!", username: req.body.username });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// 3. СМЕНА ПАРОЛЯ
exports.changePassword = async (req, res) => {
    try {
        // req.userId берется из middleware verifyToken
        const user = await User.findByPk(req.userId);

        if (!user) {
            return res.status(404).send({ message: "Пользователь не найден." });
        }

        // Проверяем старый пароль
        const passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Неверный текущий пароль!" });
        }

        // Обновляем пароль (хешируем новый)
        user.password = bcrypt.hashSync(req.body.newPassword, 8);
        await user.save();

        res.status(200).send({ message: "Пароль успешно изменен!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};