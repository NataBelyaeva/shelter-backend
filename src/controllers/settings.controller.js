// src/controllers/settings.controller.js
const db = require("../models");
const Settings = db.settings;
const Op = db.Sequelize.Op; // Добавляем Op для логических операций

// ID, который всегда используется для единственной записи настроек
const SETTINGS_ID = 1;

// --- Вспомогательная функция для фильтрации пустых значений ---
const filterEmptyFields = (data) => {
    const filteredData = {};
    for (const key in data) {
        // Проверяем, что поле не равно null, не равно undefined, и не является пустой строкой
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
            filteredData[key] = data[key];
        }
    }
    return filteredData;
};

// --- CRUD Операции ---

// 1. Получить (GET) настройки (остается без изменений)
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
                    card_number: null, // Используем имена полей из БД
                    account_number: null // Используем имена полей из БД
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

// 2. Обновить (PUT) настройки (ОБНОВЛЕНО)
exports.update = (req, res) => {
    // 1. Фильтруем входящие данные, оставляя только непустые поля
    const filteredData = filterEmptyFields(req.body);

    // 2. Проверяем, есть ли что-то для обновления
    if (Object.keys(filteredData).length === 0) {
        return res.status(400).send({
            message: "Отсутствуют данные для обновления (поля не должны быть пустыми)."
        });
    }

    // 3. Обновляем запись с ID=1
    Settings.update(filteredData, {
        where: { id: SETTINGS_ID }
    })
    .then(num => {
        if (num[0] === 1) {
            res.send({ message: "Настройки успешно обновлены." });
        } else {
            // Если обновление не удалось (записи нет), создаем новую запись
            const newSettings = { id: SETTINGS_ID, ...filteredData };
            return Settings.create(newSettings)
                .then(newData => {
                    res.send({ message: "Настройки успешно созданы." });
                });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Ошибка при обновлении настроек: " + err.message
        });
    });
};