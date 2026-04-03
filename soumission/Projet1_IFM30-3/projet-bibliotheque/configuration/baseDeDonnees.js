const { Sequelize } = require("sequelize");
const configuration = require("./environnement");

const sequelize = new Sequelize(
  configuration.baseDeDonnees.nom,
  configuration.baseDeDonnees.utilisateur,
  configuration.baseDeDonnees.motDePasse,
  {
    host: configuration.baseDeDonnees.host,
    port: configuration.baseDeDonnees.port,
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
