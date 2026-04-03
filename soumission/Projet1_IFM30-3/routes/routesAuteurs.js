const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const auteurControleur = require("../controleurs/auteurControleur");
const { validerAuteur } = require("../validations/validationAuteur");

const routeur = express.Router();

routeur.get("/", auteurControleur.listerAuteurs);
routeur.get("/:id", auteurControleur.obtenirAuteur);
routeur.post(
  "/",
  authentification,
  autoriserRoles("admin"),
  validerAuteur,
  verifierValidation,
  auteurControleur.creerAuteur
);
routeur.put(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  validerAuteur,
  verifierValidation,
  auteurControleur.modifierAuteur
);
routeur.delete(
  "/:id",
  authentification,
  autoriserRoles("admin"),
  auteurControleur.supprimerAuteur
);

module.exports = routeur;
