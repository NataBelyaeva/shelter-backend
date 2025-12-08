// src/controllers/settings.controller.js
const db = require("../models");
const Settings = db.settings;

// ID, который всегда используется для единственной записи настроек
const SETTINGS_ID = 1;

// --- CRUD Операции ---

// 1. Получить (GET) настройки
exports.findOne = (req, res) => {
    // Ищем запись с ID=1
    Settings.findByPk(SETTINGS_ID)
        .then(data => {
            if (data) {
                // Если запись найдена, возвращаем ее
                res.send(data);
            } else {
                // Если запись НЕ найдена, создаем ее с пустыми значениями
                const initialSettings = { 
                    id: SETTINGS_ID,
                    cardNumber: null, 
                    accountNumber: null 
                };
                
                Settings.create(initialSettings)
                    .then(newData => {
                        console.log("Создана новая запись Settings.");
                        res.send(newData);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Ошибка при создании начальной записи Settings."
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Ошибка при получении настроек."
            });
        });
};

// 2. Обновить (PUT) настройки
exports.update = (req, res) => {
    // Данные для обновления
    const updateData = {
        cardNumber: req.body.cardNumber,
        accountNumber: req.body.accountNumber
    };

    // Обновляем запись с ID=1
    Settings.update(updateData, {
        where: { id: SETTINGS_ID }
    })
    .then(num => {
        if (num[0] === 1) {
            res.send({ message: "Настройки успешно обновлены." });
        } else {
            // Если обновление не удалось (записи нет), создаем новую запись
            const newSettings = { id: SETTINGS_ID, ...updateData };
            return Settings.create(newSettings)
                .then(newData => {
                    res.send({ message: "Настройки успешно созданы." });
                });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Ошибка при обновлении настроек."
        });
    });
};