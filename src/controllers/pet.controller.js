// src/controllers/pet.controller.js
const db = require('../models');
const Pet = db.pets;
const { Op } = require('sequelize'); // Импортируем операторы Sequelize для фильтрации

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

  if (req.file) {
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

// READ (All): Получение всех питомцев с расширенной фильтрацией
exports.findAll = (req, res) => {
  const { gender, sterilized, tray, health, hasDescription, name } = req.query;
  let condition = {};

  // 1. Фильтр по полу (точное совпадение: male/female)
  if (gender) {
    condition.gender = gender;
  }

  // 2. Стерилизация (кастрирован)
  if (sterilized !== undefined) {
    condition.sterilized = (sterilized === 'true');
  }

  // 3. Приучен к лотку
  if (tray !== undefined) {
    condition.tray = (tray === 'true');
  }

  // 4. Поиск по описанию здоровья (частичное совпадение)
  if (health) {
    condition.health = { [Op.iLike]: `%${health}%` };
  }

  // 4. ФИЛЬТР: Есть описание или нет
  if (hasDescription !== undefined) {
    if (hasDescription === 'true') {
      // Ищем где НЕ null и НЕ пустая строка
      condition.description = { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] };
    } else {
      // Ищем где либо null, либо пустая строка
      condition.description = { [Op.or]: [{ [Op.eq]: null }, { [Op.eq]: '' }] };
    }
  }

  // 6. Поиск по имени
  if (name) {
    condition.name = { [Op.iLike]: `%${name}%` };
  }

  Pet.findAll({ where: condition, order: [['updatedAt', 'DESC']] })
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

  Pet.findByPk(id)
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

  if (req.file) {
      updateData.photo = `/uploads/${req.file.filename}`;
  }
  
  Pet.update(updateData, {
    where: { id: id },
  })
    .then(num => {
      if (num[0] === 1) {
        res.send({ message: 'Питомец был успешно обновлен.' });
      } else {
        res.send({ message: `Не удалось обновить питомца с id=${id}.` });
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
        res.send({ message: 'Питомец был успешно удален!' });
      } else {
        res.send({ message: `Не удалось удалить питомца с id=${id}.` });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Ошибка при удалении питомца с id=' + id,
      });
    });
};