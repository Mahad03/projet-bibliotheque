const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const livreControleur = require("../controleurs/livreControleur");
const { validerLivre } = require("../validations/validationLivre");

const routeur = express.Router();

routeur.get("/", livreControleur.listerLivres);
routeur.get("/:id", livreControleur.obtenirLivre);
routeur.post(
  "/",
  authentification,
  autoriserRoles("admin"),
  validerLivre,
  verifierValidation,
  livreControleur.creerLivre
);
routeur.put(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  validerLivre,
  verifierValidation,
  livreControleur.modifierLivre
);
routeur.delete(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  livreControleur.supprimerLivre
);

module.exports = routeur;
