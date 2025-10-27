// src/routes/event.routes.js
const upload = require('../middleware/upload');

module.exports = app => {
    const events = require("../controllers/event.controller.js");
    const router = require("express").Router();

    // 1. Создать новое мероприятие
    router.post("/", upload.single('image'), events.create);

    // 2. Получить все мероприятия
    router.get("/", events.findAll);

    // 3. Получить одно мероприятие по id
    router.get("/:id", events.findOne);

    // 4. Обновить мероприятие по id
    router.put("/:id", upload.single('image'), events.update);

    // 5. Удалить мероприятие по id
    router.delete("/:id", events.delete);

    app.use('/api/events', router);
};