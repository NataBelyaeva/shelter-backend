module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("event", {
        // Изображение: Путь к файлу на сервере
        image: {
            type: Sequelize.STRING(1000), // VARCHAR(1000)
            allowNull: false
        },
        // Заголовок мероприятия
        title: {
            type: Sequelize.STRING(500), // STRING(500)
            allowNull: false
        },
        // Подробное описание мероприятия
        description: {
            type: Sequelize.TEXT, // TEXT
            allowNull: false
        }
    });

    return Event;
};