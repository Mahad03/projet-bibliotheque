const { body } = require("express-validator");

const validerInscription = [
  body("nomComplet")
    .trim()
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("L'email doit etre valide."),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres."),
];

const validerConnexion = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("L'email doit etre valide."),
  body("motDePasse")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire."),
];

module.exports = {
  validerInscription,
  validerConnexion,
};
