const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Definir la table des categories.
  const Categorie = sequelize.define(
    "Categorie",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "categories",
      timestamps: true,
    }
  );

  return Categorie;
};
