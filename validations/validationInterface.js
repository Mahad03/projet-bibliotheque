const { body } = require("express-validator");

const validerConnexionInterface = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entrez un email valide."),
  body("motDePasse")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire."),
];

const validerInscriptionInterface = [
  body("nomComplet")
    .trim()
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entrez un email valide."),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres."),
];

const validerRoleInterface = [
  body("nom").trim().notEmpty().withMessage("Le nom du role est obligatoire."),
  body("description").optional({ values: "falsy" }).trim(),
];

const validerUtilisateurCreationInterface = [
  body("nomComplet")
    .trim()
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entrez un email valide."),
  body("motDePasse")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres."),
  body("roleId")
    .isInt({ min: 1 })
    .withMessage("Le role est obligatoire."),
];

const validerUtilisateurModificationInterface = [
  body("nomComplet")
    .trim()
    .notEmpty()
    .withMessage("Le nom complet est obligatoire."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entrez un email valide."),
  body("motDePasse")
    .optional({ values: "falsy" })
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres."),
  body("roleId")
    .isInt({ min: 1 })
    .withMessage("Le role est obligatoire."),
];

const validerAuteurInterface = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'auteur est obligatoire."),
  body("prenom").optional({ values: "falsy" }).trim(),
  body("biographie").optional({ values: "falsy" }).trim(),
];

const validerCategorieInterface = [
  body("nom")
    .trim()
    .notEmpty()
    .withMessage("Le nom de la categorie est obligatoire."),
  body("description").optional({ values: "falsy" }).trim(),
];

const validerLivreInterface = [
  body("titre")
    .trim()
    .notEmpty()
    .withMessage("Le titre du livre est obligatoire."),
  body("isbn").trim().notEmpty().withMessage("L'ISBN est obligatoire."),
  body("auteurId")
    .isInt({ min: 1 })
    .withMessage("Choisissez un auteur valide."),
  body("categorieId")
    .isInt({ min: 1 })
    .withMessage("Choisissez une categorie valide."),
  body("anneePublication")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("L'annee de publication doit etre valide."),
  body("quantiteTotale")
    .isInt({ min: 0 })
    .withMessage("La quantite totale doit etre un nombre entier positif."),
  body("quantiteDisponible")
    .isInt({ min: 0 })
    .withMessage("La quantite disponible doit etre un nombre entier positif."),
  body("resume").optional({ values: "falsy" }).trim(),
];

const validerEmpruntInterface = [
  body("livreId")
    .isInt({ min: 1 })
    .withMessage("Choisissez un livre valide."),
  body("dateRetourPrevue")
    .notEmpty()
    .withMessage("La date de retour prevue est obligatoire.")
    .bail()
    .isISO8601()
    .withMessage("La date de retour prevue doit etre valide."),
];

const validerModificationEmpruntInterface = [
  body("dateRetourPrevue")
    .notEmpty()
    .withMessage("La date de retour prevue est obligatoire.")
    .bail()
    .isISO8601()
    .withMessage("La date de retour prevue doit etre valide."),
  body("statut")
    .isIn(["en_cours", "retourne"])
    .withMessage("Le statut doit etre en_cours ou retourne."),
];

module.exports = {
  validerConnexionInterface,
  validerInscriptionInterface,
  validerRoleInterface,
  validerUtilisateurCreationInterface,
  validerUtilisateurModificationInterface,
  validerAuteurInterface,
  validerCategorieInterface,
  validerLivreInterface,
  validerEmpruntInterface,
  validerModificationEmpruntInterface,
};
