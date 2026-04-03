const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const empruntControleur = require("../controleurs/empruntControleur");
const {
  validerCreationEmprunt,
} = require("../validations/validationEmprunt");

const routeur = express.Router();

routeur.use(authentification);

routeur.get("/mes-emprunts", empruntControleur.listerMesEmprunts);
routeur.get("/", autoriserRoles("admin"), empruntControleur.listerEmprunts);
routeur.post(
  "/",
  validerCreationEmprunt,
  verifierValidation,
  empruntControleur.creerEmprunt
);
routeur.put("/:id/retour", empruntControleur.retournerEmprunt);

module.exports = routeur;
