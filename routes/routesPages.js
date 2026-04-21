const express = require("express");
const accueilPageControleur = require("../controleursPages/accueilPageControleur");
const authentificationPageControleur = require("../controleursPages/authentificationPageControleur");
const gestionPageControleur = require("../controleursPages/gestionPageControleur");
const {
  exigerConnexion,
  exigerRoles,
} = require("../intergiciels/protectionPages");
const televersementImage = require("../intergiciels/televersementImage");
const {
  validerAuteurInterface,
  validerCategorieInterface,
  validerConnexionInterface,
  validerEmpruntInterface,
  validerInscriptionInterface,
  validerLivreInterface,
  validerModificationEmpruntInterface,
  validerRoleInterface,
  validerUtilisateurCreationInterface,
  validerUtilisateurModificationInterface,
} = require("../validations/validationInterface");

const routeur = express.Router();

function gererTeleversementImage(req, res, next) {
  televersementImage.single("image")(req, res, (error) => {
    req.erreurTeleversement = error || null;
    next();
  });
}

routeur.get("/", accueilPageControleur.afficherAccueil);
routeur.get("/tableau-de-bord", exigerConnexion, accueilPageControleur.afficherTableauDeBord);

routeur.get("/connexion", authentificationPageControleur.afficherConnexion);
routeur.post(
  "/connexion",
  validerConnexionInterface,
  authentificationPageControleur.traiterConnexion
);
routeur.get("/inscription", authentificationPageControleur.afficherInscription);
routeur.post(
  "/inscription",
  validerInscriptionInterface,
  authentificationPageControleur.traiterInscription
);
routeur.post("/deconnexion", authentificationPageControleur.deconnexion);

routeur.get("/roles", exigerRoles("administrateur"), gestionPageControleur.listerRoles);
routeur.get(
  "/roles/nouveau",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherCreationRole
);
routeur.post(
  "/roles/nouveau",
  exigerRoles("administrateur"),
  validerRoleInterface,
  gestionPageControleur.creerRole
);
routeur.get(
  "/roles/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationRole
);
routeur.post(
  "/roles/:id/modifier",
  exigerRoles("administrateur"),
  validerRoleInterface,
  gestionPageControleur.modifierRole
);
routeur.post(
  "/roles/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerRole
);

routeur.get(
  "/utilisateurs",
  exigerRoles("administrateur"),
  gestionPageControleur.listerUtilisateurs
);
routeur.get(
  "/utilisateurs/nouveau",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherCreationUtilisateur
);
routeur.post(
  "/utilisateurs/nouveau",
  exigerRoles("administrateur"),
  validerUtilisateurCreationInterface,
  gestionPageControleur.creerUtilisateur
);
routeur.get(
  "/utilisateurs/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationUtilisateur
);
routeur.post(
  "/utilisateurs/:id/modifier",
  exigerRoles("administrateur"),
  validerUtilisateurModificationInterface,
  gestionPageControleur.modifierUtilisateur
);
routeur.post(
  "/utilisateurs/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerUtilisateur
);

routeur.get("/auteurs", gestionPageControleur.listerAuteurs);
routeur.get(
  "/auteurs/nouveau",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherCreationAuteur
);
routeur.post(
  "/auteurs/nouveau",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerAuteurInterface,
  gestionPageControleur.creerAuteur
);
routeur.get(
  "/auteurs/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationAuteur
);
routeur.post(
  "/auteurs/:id/modifier",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerAuteurInterface,
  gestionPageControleur.modifierAuteur
);
routeur.post(
  "/auteurs/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerAuteur
);

routeur.get("/categories", gestionPageControleur.listerCategories);
routeur.get(
  "/categories/nouvelle",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherCreationCategorie
);
routeur.post(
  "/categories/nouvelle",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerCategorieInterface,
  gestionPageControleur.creerCategorie
);
routeur.get(
  "/categories/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationCategorie
);
routeur.post(
  "/categories/:id/modifier",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerCategorieInterface,
  gestionPageControleur.modifierCategorie
);
routeur.post(
  "/categories/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerCategorie
);

routeur.get("/livres", gestionPageControleur.listerLivres);
routeur.get(
  "/livres/nouveau",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherCreationLivre
);
routeur.post(
  "/livres/nouveau",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerLivreInterface,
  gestionPageControleur.creerLivre
);
routeur.get(
  "/livres/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationLivre
);
routeur.post(
  "/livres/:id/modifier",
  exigerRoles("administrateur"),
  gererTeleversementImage,
  validerLivreInterface,
  gestionPageControleur.modifierLivre
);
routeur.post(
  "/livres/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerLivre
);

routeur.get("/emprunts", exigerConnexion, gestionPageControleur.listerEmprunts);
routeur.get(
  "/emprunts/nouveau",
  exigerConnexion,
  gestionPageControleur.afficherCreationEmprunt
);
routeur.post(
  "/emprunts/nouveau",
  exigerConnexion,
  validerEmpruntInterface,
  gestionPageControleur.creerEmprunt
);
routeur.get(
  "/emprunts/:id/modifier",
  exigerRoles("administrateur"),
  gestionPageControleur.afficherModificationEmprunt
);
routeur.post(
  "/emprunts/:id/modifier",
  exigerRoles("administrateur"),
  validerModificationEmpruntInterface,
  gestionPageControleur.modifierEmprunt
);
routeur.post(
  "/emprunts/:id/retourner",
  exigerConnexion,
  gestionPageControleur.retournerEmprunt
);
routeur.post(
  "/emprunts/:id/supprimer",
  exigerRoles("administrateur"),
  gestionPageControleur.supprimerEmprunt
);

module.exports = routeur;
