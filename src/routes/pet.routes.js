// src/routes/pet.routes.js
const upload = require('../middleware/upload');

module.exports = app => {
    const pets = require("../controllers/pet.controller.js");
    const router = require("express").Router();

    // CREATE: Создать нового питомца
    router.post("/", upload.single('photo'), pets.create);

    // READ: Получить всех питомцев
    router.get("/", pets.findAll);

    // READ: Получить одного питомца по id
    router.get("/:id", pets.findOne);

    // UPDATE: Обновить питомца по id
    // Также используем upload.single('photo'), если нужно обновить фотографию
    router.put("/:id", upload.single('photo'), pets.update);

    // DELETE: Удалить питомца по id
    router.delete("/:id", pets.delete);

    app.use('/api/pets', router);
};