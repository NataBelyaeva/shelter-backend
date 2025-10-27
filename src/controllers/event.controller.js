// src/controllers/event.controller.js
const db = require("../models");
const Event = db.events; // Используем модель Event
const Op = db.Sequelize.Op;
const path = require('path');
const fs = require('fs');

// --- Вспомогательная функция для удаления изображения ---
const deleteImageFile = (imagePath) => {
    // ИЗМЕНЕНИЕ: Проверяем, что путь начинается с /uploads/
    if (imagePath && imagePath.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '..', 'public', imagePath);
        fs.unlink(fullPath, (err) => {
            if (err) {
                // Игнорируем ошибку, если файла не существует (ENOENT)
                if (err.code !== 'ENOENT') {
                    console.error("Ошибка при удалении старого файла изображения:", err);
                }
            } else {
                console.log(`Файл удален: ${fullPath}`);
            }
        });
    }
};

// --- CRUD Операции ---

// 1. Создать (CREATE) новое мероприятие
exports.create = (req, res) => {
    // Проверка наличия файла
    if (!req.file) {
        return res.status(400).send({ message: "Необходимо загрузить изображение для мероприятия." });
    }
    
    // ИЗМЕНЕНИЕ: Формируем путь к файлу /uploads/
    const imagePath = `/uploads/${req.file.filename}`;

    const event = {
        title: req.body.title,
        description: req.body.description,
        image: imagePath // Сохраняем путь в базу данных
    };

    Event.create(event)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Произошла ошибка при создании мероприятия."
            });
        });
};

// 2. Получить все (READ all) мероприятия
exports.findAll = (req, res) => {
    Event.findAll({ 
        order: [['createdAt', 'DESC']] // Сортировка по дате создания (новые сверху)
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Произошла ошибка при получении мероприятий."
        });
    });
};

// 2.5. Получить одно мероприятие по id (READ One)
exports.findOne = (req, res) => {
    const id = req.params.id;

    Event.findByPk(id) // Поиск по первичному ключу (Primary Key)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Не удалось найти мероприятие с id=${id}.`,
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка при получении мероприятия с id=" + id,
            });
        });
};

// 3. Обновить (UPDATE) мероприятие по ID
exports.update = (req, res) => {
    const id = req.params.id;
    
    // Получаем текущее мероприятие для проверки старого изображения
    Event.findByPk(id)
        .then(event => {
            if (!event) {
                return res.status(404).send({ message: `Мероприятие с id=${id} не найдено.` });
            }

            const updatedData = {
                title: req.body.title,
                description: req.body.description
            };

            // Если загружен новый файл, обновляем путь и удаляем старый файл
            if (req.file) {
                // Удаляем старый файл, который был сохранен в event.image
                deleteImageFile(event.image); 
                
                // ИЗМЕНЕНИЕ: Обновляем путь к новому файлу на /uploads/
                updatedData.image = `/uploads/${req.file.filename}`;
            }

            // Обновляем запись в БД
            return Event.update(updatedData, { where: { id: id } });
        })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Мероприятие успешно обновлено." });
            } else {
                res.send({ message: `Невозможно обновить мероприятие с id=${id}. Возможно, оно не найдено.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ошибка при обновлении мероприятия с id=" + id });
        });
};

// 4. Удалить (DELETE) мероприятие по ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Event.findByPk(id)
        .then(event => {
            if (event) {
                // Удаляем файл изображения с сервера
                deleteImageFile(event.image);
            }
            
            // Удаляем запись из БД
            return Event.destroy({ where: { id: id } });
        })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Мероприятие успешно удалено!" });
            } else {
                res.send({ message: `Невозможно удалить мероприятие с id=${id}. Возможно, оно не найдено.` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Не удалось удалить мероприятие с id=" + id });
        });
};