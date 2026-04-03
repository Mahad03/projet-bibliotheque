const sequelize = require("../configuration/baseDeDonnees");
const creerRole = require("./Role");
const creerUtilisateur = require("./Utilisateur");
const creerAuteur = require("./Auteur");
const creerCategorie = require("./Categorie");
const creerLivre = require("./Livre");
const creerEmprunt = require("./Emprunt");

const Role = creerRole(sequelize);
const Utilisateur = creerUtilisateur(sequelize);
const Auteur = creerAuteur(sequelize);
const Categorie = creerCategorie(sequelize);
const Livre = creerLivre(sequelize);
const Emprunt = creerEmprunt(sequelize);

Role.hasMany(Utilisateur, {
  foreignKey: "roleId",
  as: "utilisateurs",
});
Utilisateur.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

Auteur.hasMany(Livre, {
  foreignKey: "auteurId",
  as: "livres",
});
Livre.belongsTo(Auteur, {
  foreignKey: "auteurId",
  as: "auteur",
});

Categorie.hasMany(Livre, {
  foreignKey: "categorieId",
  as: "livres",
});
Livre.belongsTo(Categorie, {
  foreignKey: "categorieId",
  as: "categorie",
});

Utilisateur.hasMany(Emprunt, {
  foreignKey: "utilisateurId",
  as: "emprunts",
});
Emprunt.belongsTo(Utilisateur, {
  foreignKey: "utilisateurId",
  as: "utilisateur",
});

Livre.hasMany(Emprunt, {
  foreignKey: "livreId",
  as: "emprunts",
});
Emprunt.belongsTo(Livre, {
  foreignKey: "livreId",
  as: "livre",
});

module.exports = {
  sequelize,
  Role,
  Utilisateur,
  Auteur,
  Categorie,
  Livre,
  Emprunt,
};
