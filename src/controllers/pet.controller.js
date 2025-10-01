// src/controllers/pet.controller.js
const db = require('../models');
const Pet = db.pets;

//  CREATE: Создание нового питомца
exports.create = (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({ message: "Имя не может быть пустым!" });
  }
  if (!req.body.age) {
    return res.status(400).send({ message: "Возраст не может быть пустым!" });
  }
  if (!req.body.gender) {
    return res.status(400).send({ message: "Пол не может быть пустым!" });
  }
  
  const petData = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    health: req.body.health,
    description: req.body.description,
    sterilized: req.body.sterilized,
    tray: req.body.tray,
  };

  // Проверяем, был ли загружен файл
  if (req.file) {
    // Формируем путь, который будет сохранен в БД
    petData.photo = `/uploads/${req.file.filename}`;
  }

  Pet.create(petData)
    .then(data => {
      res.status(201).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Произошла ошибка при создании питомца.',
      });
    });
};

// ---

// READ (All): Получение всех питомцев
exports.findAll = (req, res) => {
  Pet.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Произошла ошибка при получении списка питомцев.',
      });
    });
};

// ---

// READ (One): Получение одного питомца по id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pet.findByPk(id) // Поиск по первичному ключу (Primary Key)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Не удалось найти питомца с id=${id}.`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка при получении питомца с id=" + id,
      });
    });
};

// ---

// UPDATE: Обновление питомца по id
exports.update = (req, res) => {
  const id = req.params.id;

  const updateData = req.body;

  // Если в запросе на обновление есть новый файл, добавляем путь к нему
  if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
  }
  
  Pet.update(updateData, {
    where: { id: id },
  })
    .then(num => {
      if (num[0] === 1) { // num - это массив, где первый элемент - количество обновленных строк
        res.send({
          message: 'Питомец был успешно обновлен.',
        });
      } else {
        res.send({
          message: `Не удалось обновить питомца с id=${id}. Возможно, он не был найден или тело запроса пустое.`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Ошибка при обновлении питомца с id=' + id,
      });
    });
};

// ---

// DELETE: Удаление питомца по id
exports.delete = (req, res) => {
  const id = req.params.id;

  Pet.destroy({
    where: { id: id },
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: 'Питомец был успешно удален!',
        });
      } else {
        res.send({
          message: `Не удалось удалить питомца с id=${id}. Возможно, он не был найден.`,
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Ошибка при удалении питомца с id=' + id,
      });
    });
};