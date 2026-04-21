function exigerConnexion(req, res, next) {
  if (!req.utilisateurInterface) {
    return res.redirect(
      "/connexion?erreur=Vous devez vous connecter pour acceder a cette page."
    );
  }

  return next();
}

function exigerRoles(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.utilisateurInterface) {
      return res.redirect(
        "/connexion?erreur=Vous devez vous connecter pour acceder a cette page."
      );
    }

    if (!rolesAutorises.includes(req.utilisateurInterface.role.nom)) {
      return res.redirect(
        "/tableau-de-bord?erreur=Vous n'avez pas les droits pour cette action."
      );
    }

    return next();
  };
}

module.exports = {
  exigerConnexion,
  exigerRoles,
};
