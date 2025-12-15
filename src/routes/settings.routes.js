// src/routes/settings.routes.js

module.exports = app => {
    const settings = require("../controllers/settings.controller.js");
    var router = require("express").Router();

    const { verifyToken } = require('../middleware/authJwt');

    // Получить единственную запись настроек
    router.get("/", settings.findOne);

    // Обновить единственную запись настроек
    router.put("/", [verifyToken], settings.update);

    app.use('/api/settings', router);
};