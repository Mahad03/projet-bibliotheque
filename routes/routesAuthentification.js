const express = require("express");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const authentificationControleur = require("../controleurs/authentificationControleur");
const {
  validerConnexion,
  validerInscription,
} = require("../validations/validationAuthentification");

const routeur = express.Router();

// Route publique pour creer un nouveau membre
routeur.post(
  "/inscription",
  validerInscription,
  verifierValidation,
  authentificationControleur.inscription
);

// Route publique pour se connecter
routeur.post(
  "/connexion",
  validerConnexion,
  verifierValidation,
  authentificationControleur.connexion
);

// Route protegee pour recuperer le profil du token courant
routeur.get("/profil", authentification, authentificationControleur.profil);

module.exports = routeur;
