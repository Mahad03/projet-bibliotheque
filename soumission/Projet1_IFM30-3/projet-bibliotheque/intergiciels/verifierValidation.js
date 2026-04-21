const { validationResult } = require("express-validator");

// Bloquer la route si express-validator detecte des erreurs.
function verifierValidation(req, res, next) {
  const erreurs = validationResult(req);

  if (!erreurs.isEmpty()) {
    return res.status(400).json({
      message: "Les donnees envoyees sont invalides.",
      erreurs: erreurs.array(),
    });
  }

  next();
}

module.exports = verifierValidation;
