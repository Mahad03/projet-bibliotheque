const { body } = require("express-validator");

const validerLivre = [
  body("titre")
    .trim()
    .notEmpty()
    .withMessage("Le titre est obligatoire."),
  body("isbn")
    .trim()
    .notEmpty()
    .withMessage("L'isbn est obligatoire."),
  body("auteurId")
    .isInt({ min: 1 })
    .withMessage("L'auteur doit etre valide."),
  body("categorieId")
    .isInt({ min: 1 })
    .withMessage("La categorie doit etre valide."),
  body("anneePublication")
    .optional()
    .isInt({ min: 0 })
    .withMessage("L'annee de publication doit etre un nombre valide."),
  body("quantiteTotale")
    .optional()
    .isInt({ min: 0 })
    .withMessage("La quantite totale doit etre un entier positif."),
  body("quantiteDisponible")
    .optional()
    .isInt({ min: 0 })
    .withMessage("La quantite disponible doit etre un entier positif."),
  body("resume").optional().trim(),
];

module.exports = {
  validerLivre,
};
