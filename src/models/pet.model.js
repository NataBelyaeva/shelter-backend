// src/models/pet.model.js
module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('pet', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100), 
        allowNull: false, // обязательное поле
      },
      age: {
        type: DataTypes.STRING(50),
        allowNull: false, // обязательное поле
      },
      gender: {
        type: DataTypes.STRING(20), 
        allowNull: false, // обязательное поле
      },
      health: {
        type: DataTypes.STRING(150),
      },
      description: {
        type: DataTypes.TEXT,
      },
      sterilized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      tray: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      photo: {
        type: DataTypes.STRING(1000), 
      },
    });
  
    return Pet;
  };