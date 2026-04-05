const { body } = require("express-validator");

// Verifier que l'emprunt contient un livre valide.
const validerCreationEmprunt = [
  body("livreId")
    .isInt({ min: 1 })
    .withMessage("Le livre doit etre valide."),
];

module.exports = {
  validerCreationEmprunt,
};
