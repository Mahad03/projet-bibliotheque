function autoriserRoles(...rolesAutorises) {
  return (req, res, next) => {
    if (!req.utilisateur) {
      return res.status(401).json({
        message: "Utilisateur non authentifie.",
      });
    }

    if (!rolesAutorises.includes(req.utilisateur.roleNom)) {
      return res.status(403).json({
        message: "Vous n'avez pas les droits necessaires.",
      });
    }

    next();
  };
}

module.exports = autoriserRoles;

