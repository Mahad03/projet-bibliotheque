const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");

function authentification(req, res, next) {
  try {
    const enTeteAutorisation = req.headers.authorization;

    // Le token doit etre envoye sous la forme:
    // Authorization: Bearer votre_token
    if (!enTeteAutorisation || !enTeteAutorisation.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acces refuse. Token manquant.",
      });
    }

    const token = enTeteAutorisation.split(" ")[1];
    const utilisateurToken = jwt.verify(
      token,
      configuration.authentification.secretJwt
    );

    // On stocke l'utilisateur decode dans req pour les routes suivantes.
    req.utilisateur = utilisateurToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expire.",
    });
  }
}

module.exports = authentification;
