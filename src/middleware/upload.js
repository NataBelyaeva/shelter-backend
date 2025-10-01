// src/middleware/upload.js
const multer = require('multer');

// Определяем, как и где хранить файлы
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Указываем папку для сохранения файлов
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла, чтобы избежать конфликтов
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

// Middleware для загрузки
const upload = multer({ storage: storage });

module.exports = upload;