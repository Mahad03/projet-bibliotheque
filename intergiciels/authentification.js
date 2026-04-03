const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");

function authentification(req, res, next) {
  try {
    const headerAutorisation = req.headers.authorization;

    if (!headerAutorisation || !headerAutorisation.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acces refuse. Token manquant.",
      });
    }

    const token = headerAutorisation.split(" ")[1];
    const tokenDecode = jwt.verify(token, configuration.authentification.secretJwt);

    req.utilisateur = tokenDecode;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expire.",
    });
  }
}

module.exports = authentification;
