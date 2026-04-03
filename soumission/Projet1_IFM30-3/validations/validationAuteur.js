const { body } = require("express-validator");

const validerAuteur = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'auteur est obligatoire."),
  body("prenom").optional().trim(),
  body("biographie").optional().trim(),
];

module.exports = {
  validerAuteur,
};
