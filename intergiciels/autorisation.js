function autoriserRoles(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        message: "Utilisateur non authentifie.",
      });
    }

    // Ici on verifie si le role present dans le token
    // fait partie des roles acceptes pour cette route.
    if (!rolesAutorises.includes(req.utilisateur.roleNom)) {
      return res.status(403).json({
        message: "Vous n'avez pas les droits necessaires.",
      });
    }

    next();
  };
}

module.exports = autoriserRoles;
