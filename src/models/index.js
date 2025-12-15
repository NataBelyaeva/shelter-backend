// src/models/index.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Подключаемся к БД, используя DATABASE_URL из .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключаем модель Pet
db.pets = require('./pet.model.js')(sequelize, Sequelize);
db.events = require("./event.model.js")(sequelize, Sequelize);
db.settings = require("./settings.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;