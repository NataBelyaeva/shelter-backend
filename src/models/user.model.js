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
        // Роль мы пока не добавляем, предполагая, что все пользователи — администраторы
    }, {
        // Имя таблицы в БД
        tableName: 'users' 
    });

    return User;
};