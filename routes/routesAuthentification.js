const express = require("express");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const authentificationControleur = require("../controleurs/authentificationControleur");
const {
  validerConnexion,
  validerInscription,
} = require("../validations/validationAuthentification");

const routeur = express.Router();

routeur.post(
  "/inscription",
  validerInscription,
  verifierValidation,
  authentificationControleur.inscription
);
routeur.post(
  "/connexion",
  validerConnexion,
  verifierValidation,
  authentificationControleur.connexion
);
routeur.get("/profil", authentification, authentificationControleur.profil);

module.exports = routeur;
