// src/routes/settings.routes.js

module.exports = app => {
    const settings = require("../controllers/settings.controller.js");
    var router = require("express").Router();

    // Получить единственную запись настроек
    router.get("/", settings.findOne);

    // Обновить единственную запись настроек
    router.put("/", settings.update);

    app.use('/api/settings', router);
};