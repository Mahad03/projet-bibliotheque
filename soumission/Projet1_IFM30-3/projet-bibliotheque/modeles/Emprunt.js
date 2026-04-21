const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Definir la table des emprunts.
  const Emprunt = sequelize.define(
    "Emprunt",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dateEmprunt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dateRetourPrevue: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      dateRetourEffective: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      statut: {
        type: DataTypes.ENUM("en_cours", "retourne"),
        allowNull: false,
        defaultValue: "en_cours",
      },
    },
    {
      tableName: "emprunts",
      timestamps: true,
    }
  );

  return Emprunt;
};
