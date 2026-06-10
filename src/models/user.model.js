// src/models/user.model.js
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        // Мы используем id в качестве первичного ключа
        
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true // Логин должен быть уникальным
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        // Имя таблицы в БД
        tableName: 'users' 
    });

    return User;
};