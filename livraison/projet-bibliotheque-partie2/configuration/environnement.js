const crypto = require("crypto");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
  quiet: true,
});

// Generer un secret provisoire si aucun vrai secret de jeton n'est fourni.
function genererSecretJetonTemporaire() {
  return crypto.randomBytes(32).toString("hex");
}

function estValeurExemple(valeur) {
  if (!valeur) {
    return true;
  }

  return valeur.includes("changez") || valeur.includes("exemple");
}

// Regrouper toutes les variables d'environnement utiles au projet.
const secretJeton = estValeurExemple(process.env.SECRET_JETON)
  ? genererSecretJetonTemporaire()
  : process.env.SECRET_JETON;

const configuration = {
  port: Number(process.env.PORT) || 3000,
  baseDeDonnees: {
    host: process.env.HOTE_BD || "localhost",
    port: Number(process.env.PORT_BD) || 3306,
    nom: process.env.NOM_BD || "bibliotheque_db",
    utilisateur: process.env.UTILISATEUR_BD || "root",
    motDePasse: process.env.MOT_DE_PASSE_BD || "",
  },
  authentification: {
    secretJeton,
    secretTemporaire: estValeurExemple(process.env.SECRET_JETON),
    courrielAdministrateur: process.env.COURRIEL_ADMINISTRATEUR || "",
    motDePasseAdministrateur:
      process.env.MOT_DE_PASSE_ADMINISTRATEUR || "",
    nomCompletAdministrateur:
      process.env.NOM_COMPLET_ADMINISTRATEUR || "Administrateur principal",
  },
};

module.exports = configuration;
