const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Definir la table des livres.
  const Livre = sequelize.define(
    "Livre",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      titre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resume: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      anneePublication: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      quantiteTotale: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      quantiteDisponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "livres",
      timestamps: true,
    }
  );

  return Livre;
};
