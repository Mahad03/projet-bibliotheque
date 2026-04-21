const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");

function authentification(req, res, next) {
  try {
    const enTeteAutorisation = req.headers.authorization;

    // Le jeton doit etre envoye sous la forme:
    // Authorization: Bearer votre_jeton
    if (!enTeteAutorisation || !enTeteAutorisation.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acces refuse. Jeton manquant.",
      });
    }

    const jeton = enTeteAutorisation.split(" ")[1];
    const utilisateurJeton = jwt.verify(
      jeton,
      configuration.authentification.secretJeton
    );

    // On stocke l'utilisateur decode dans req pour les routes suivantes.
    req.utilisateur = utilisateurJeton;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Jeton invalide ou expire.",
    });
  }
}

module.exports = authentification;
