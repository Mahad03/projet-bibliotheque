const { body } = require("express-validator");

// Verifier les champs recus pour une categorie.
const validerCategorie = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom de la categorie est obligatoire."),
  body("description").optional().trim(),
];

module.exports = {
  validerCategorie,
};
