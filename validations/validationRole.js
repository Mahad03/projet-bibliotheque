const { body } = require("express-validator");

// Verifier les champs recus pour un role.
const validerRole = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom du role est obligatoire."),
  body("description").optional().trim(),
];

module.exports = {
  validerRole,
};
