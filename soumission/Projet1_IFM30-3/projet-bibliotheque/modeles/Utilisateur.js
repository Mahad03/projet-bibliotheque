const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Definir la table des utilisateurs.
  const Utilisateur = sequelize.define(
    "Utilisateur",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nomComplet: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "utilisateurs",
      timestamps: true,
    }
  );

  return Utilisateur;
};
