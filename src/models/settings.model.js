// src/models/settings.model.js

module.exports = (sequelize, Sequelize) => {
    const Settings = sequelize.define("settings", {
        // Мы используем id=1 для единственной записи настроек
        
        cardNumber: {
            type: Sequelize.STRING,
            allowNull: true, // Разрешаем пустое, если реквизиты еще не добавлены
            field: 'card_number' // Имя колонки в базе данных (snake_case)
        },
        accountNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'account_number' // Имя колонки в базе данных (snake_case)
        }
    }, {
        // Запрещаем автоматическое добавление полей createdAt и updatedAt
        timestamps: false,
        // Имя таблицы в БД
        tableName: 'settings' 
    });

    return Settings;
};