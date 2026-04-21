const { validationResult } = require("express-validator");

function extraireErreurs(req) {
  const resultat = validationResult(req);

  if (resultat.isEmpty()) {
    return {};
  }

  const erreurs = {};

  for (const erreur of resultat.array()) {
    if (!erreurs[erreur.path]) {
      erreurs[erreur.path] = erreur.msg;
    }
  }

  return erreurs;
}

function valeurBooleenne(valeur) {
  return valeur === true || valeur === "true" || valeur === "on" || valeur === 1;
}

function imageDepuisFichier(req, valeurExistante) {
  if (req.file) {
    return "/public/televersements/" + req.file.filename;
  }

  return valeurExistante || null;
}

function donnerErreurMulter(error) {
  if (!error) {
    return "";
  }

  if (error.message) {
    return error.message;
  }

  return "Impossible de televerser cette image.";
}

module.exports = {
  extraireErreurs,
  valeurBooleenne,
  imageDepuisFichier,
  donnerErreurMulter,
};
