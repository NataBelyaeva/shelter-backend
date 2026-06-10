// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Делаем папку public/uploads доступной статически
app.use('/uploads', express.static('public/uploads'));

const db = require('./models');

// Синхронизация с облачной БД Neon
db.sequelize.sync()
  .then(() => {
    console.log('БД Neon успешно синхронизирована.');
  })
  .catch((err) => {
    console.error('Ошибка синхронизации с БД:', err);
  });

app.get('/', (req, res) => {
  res.send('Сервер запущен');
});

// маршруты 
require('./routes/pet.routes.js')(app);
require("./routes/event.routes.js")(app);
require("./routes/settings.routes.js")(app);
require('./routes/auth.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});