const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const categorieControleur = require("../controleurs/categorieControleur");
const {
  validerCategorie,
} = require("../validations/validationCategorie");

const routeur = express.Router();

// Lecture publique des categories.
routeur.get("/", categorieControleur.listerCategories);
routeur.get("/:id", categorieControleur.obtenirCategorie);

// Ecriture reservee a l'admin.
routeur.post(
  "/",
  authentification,
  autoriserRoles("admin"),
  validerCategorie,
  verifierValidation,
  categorieControleur.creerCategorie
);
routeur.put(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  validerCategorie,
  verifierValidation,
  categorieControleur.modifierCategorie
);
routeur.delete(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  categorieControleur.supprimerCategorie
);

module.exports = routeur;
