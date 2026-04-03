const { body } = require("express-validator");

const validerCreationEmprunt = [
  body("livreId")
    .isInt({ min: 1 })
    .withMessage("Le livre doit etre valide."),
];

module.exports = {
  validerCreationEmprunt,
};
