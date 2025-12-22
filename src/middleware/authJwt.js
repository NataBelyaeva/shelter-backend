const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

// Добавляем const для объявления функции
const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    if (!token) {
        return res.status(403).send({
            message: "No token provided! Access denied."
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized! Token is invalid or expired."
            });
        }
        
        req.userId = decoded.id;
        next();
    });
};

// Экспортируем объект, содержащий функцию
const authJwt = {
    verifyToken: verifyToken
};

module.exports = authJwt;