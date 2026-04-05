const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  // Definir la table des roles.
  const Role = sequelize.define(
    "Role",
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
    },
    {
      tableName: "roles",
      timestamps: true,
    }
  );

  return Role;
};
