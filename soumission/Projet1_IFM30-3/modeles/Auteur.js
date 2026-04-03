const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Auteur = sequelize.define(
    "Auteur",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      biographie: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "auteurs",
      timestamps: true,
    }
  );

  return Auteur;
};
