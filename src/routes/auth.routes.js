const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/auth.controller");
const cors = require('cors');

module.exports = function(app) {
    app.use(cors());

    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Публичный маршрут для входа
    app.post("/api/auth/signin", controller.signin);

    // ЗАЩИЩЕННЫЕ МАРШРУТЫ (требуют токен в заголовке)
    
    // Создание нового пользователя (только залогиненный админ может создать другого)
    app.post(
        "/api/auth/signup", 
        [authJwt.verifyToken], 
        controller.signup
    );

    // Смена собственного пароля
    app.put(
        "/api/auth/change-password", 
        [authJwt.verifyToken], 
        controller.changePassword
    );
};