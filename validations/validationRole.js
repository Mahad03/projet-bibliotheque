const { body } = require("express-validator");

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
