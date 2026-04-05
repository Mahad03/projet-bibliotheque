const express = require("express");
const autoriserRoles = require("../intergiciels/autorisation");
const authentification = require("../intergiciels/authentification");
const verifierValidation = require("../intergiciels/verifierValidation");
const roleControleur = require("../controleurs/roleControleur");
const { validerRole } = require("../validations/validationRole");

const routeur = express.Router();

// Toutes les routes roles sont reservees a l'administrateur.
routeur.use(authentification);
routeur.use(autoriserRoles("admin"));

routeur.get("/", roleControleur.listerRoles);
routeur.get("/:id", roleControleur.obtenirRole);
routeur.post("/", validerRole, verifierValidation, roleControleur.creerRole);
routeur.put("/:id", validerRole, verifierValidation, roleControleur.modifierRole);
routeur.delete("/:id", roleControleur.supprimerRole);

module.exports = routeur;
