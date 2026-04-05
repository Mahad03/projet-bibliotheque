const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const utilisateurControleur = require("../controleurs/utilisateurControleur");
const {
  validerUtilisateur,
} = require("../validations/validationUtilisateur");

const routeur = express.Router();

// Toutes les routes utilisateurs sont reservees a l'administrateur.
routeur.use(authentification);
routeur.use(autoriserRoles("admin"));

routeur.get("/", utilisateurControleur.listerUtilisateurs);
routeur.get("/:id", utilisateurControleur.obtenirUtilisateur);
routeur.put(
  "/:id",
  validerUtilisateur,
  verifierValidation,
  utilisateurControleur.modifierUtilisateur
);
routeur.delete("/:id", utilisateurControleur.supprimerUtilisateur);

module.exports = routeur;
