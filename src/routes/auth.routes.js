const controller = require("../controllers/auth.controller");
const cors = require('cors'); // Подключаем CORS, чтобы разрешить запросы с фронтенда

module.exports = function(app) {
    // Используем CORS для всех маршрутов
    app.use(cors());

    // Middleware для установки заголовков, нужных для JWT
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // Маршрут для входа в систему (возвращает JWT)
    app.post(
      "/api/auth/signin",
      controller.signin
    );
};