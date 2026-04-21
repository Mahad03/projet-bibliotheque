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

// Un role peut etre associe a plusieurs utilisateurs.
Role.hasMany(Utilisateur, {
  foreignKey: "roleId",
  as: "utilisateurs",
});
Utilisateur.belongsTo(Role, {
  foreignKey: "roleId",
  as: "role",
});

// Un auteur peut avoir plusieurs livres.
Auteur.hasMany(Livre, {
  foreignKey: "auteurId",
  as: "livres",
});
Livre.belongsTo(Auteur, {
  foreignKey: "auteurId",
  as: "auteur",
});

// Une categorie peut contenir plusieurs livres.
Categorie.hasMany(Livre, {
  foreignKey: "categorieId",
  as: "livres",
});
Livre.belongsTo(Categorie, {
  foreignKey: "categorieId",
  as: "categorie",
});

// Un utilisateur peut faire plusieurs emprunts.
Utilisateur.hasMany(Emprunt, {
  foreignKey: "utilisateurId",
  as: "emprunts",
});
Emprunt.belongsTo(Utilisateur, {
  foreignKey: "utilisateurId",
  as: "utilisateur",
});

// Un livre peut etre emprunte plusieurs fois.
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
