const { body } = require("express-validator");

const validerUtilisateur = [
  body("nomComplet")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Le nom complet ne peut pas etre vide."),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("L'email doit etre valide."),
  body("motDePasse")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres."),
  body("roleId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le role doit etre valide."),
  body("actif")
    .optional()
    .isBoolean()
    .withMessage("Le champ actif doit etre vrai ou faux."),
];

module.exports = {
  validerUtilisateur,
};
