const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ------------------------------------------------------------------
// 1. ВХОД В СИСТЕМУ (SIGNIN)
// Получение токена для доступа к защищенным маршрутам
// ------------------------------------------------------------------
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