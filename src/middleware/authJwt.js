// src/middleware/authJwt.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Функция-Middleware для проверки токена
verifyToken = (req, res, next) => {
    // 1. Получаем токен из заголовка Authorization
    // Токен приходит в формате: Authorization: Bearer <token>
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Если токен пришел через Authorization: Bearer, извлекаем только сам токен
    if (token && token.startsWith('Bearer ')) {
        // Убираем "Bearer " из строки
        token = token.slice(7, token.length);
    }

    // 2. Если токена нет, возвращаем ошибку 403 (Forbidden)
    if (!token) {
        return res.status(403).send({
            message: "No token provided! Access denied."
        });
    }

    // 3. Верифицируем токен
    jwt.verify(token, config.secret, (err, decoded) => {
        // Если верификация не удалась (срок истек, подпись неверна и т.д.)
        if (err) {
            return res.status(401).send({
                message: "Unauthorized! Token is invalid or expired."
            });
        }
        
        // 4. Если токен действителен, сохраняем ID пользователя в объекте запроса (req)
        // Это позволит нам знать, кто отправил запрос.
        req.userId = decoded.id;
        
        // 5. Переходим к следующей функции (контроллеру)
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;