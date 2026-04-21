const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");
const { Role, Utilisateur } = require("../modeles");

async function chargerUtilisateurInterface(req, res, next) {
  res.locals.utilisateurConnecte = null;
  res.locals.pageActive = "";
  res.locals.messageSucces = req.query.succes || "";
  res.locals.messageErreur = req.query.erreur || "";

  const jeton = req.cookies?.jetonInterface;

  if (!jeton) {
    return next();
  }

  try {
    const donneesJeton = jwt.verify(
      jeton,
      configuration.authentification.secretJeton
    );

    const utilisateur = await Utilisateur.findByPk(donneesJeton.id, {
      attributes: { exclude: ["motDePasse"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "nom", "description"],
        },
      ],
    });

    if (!utilisateur || !utilisateur.actif) {
      res.clearCookie("jetonInterface");
      return next();
    }

    req.utilisateurInterface = utilisateur;
    res.locals.utilisateurConnecte = utilisateur;
    return next();
  } catch (error) {
    res.clearCookie("jetonInterface");
    return next();
  }
}

module.exports = chargerUtilisateurInterface;
