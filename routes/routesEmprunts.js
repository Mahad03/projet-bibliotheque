const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const empruntControleur = require("../controleurs/empruntControleur");
const {
  validerCreationEmprunt,
} = require("../validations/validationEmprunt");

const routeur = express.Router();

// Toutes les routes d'emprunt demandent un utilisateur connecte.
routeur.use(authentification);

// Un membre voit seulement ses emprunts.
routeur.get("/mes-emprunts", empruntControleur.listerMesEmprunts);

// La liste complete est reservee a l'admin.
routeur.get("/", autoriserRoles("admin"), empruntControleur.listerEmprunts);

// Un membre peut creer un emprunt.
routeur.post(
  "/",
  validerCreationEmprunt,
  verifierValidation,
  empruntControleur.creerEmprunt
);

// L'admin ou le proprietaire de l'emprunt peut faire le retour.
routeur.put("/:id/retour", empruntControleur.retournerEmprunt);

module.exports = routeur;
