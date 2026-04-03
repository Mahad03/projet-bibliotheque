const crypto = require("crypto");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
  quiet: true,
});

function genererSecretTemporaire() {
  return crypto.randomBytes(32).toString("hex");
}

function estValeurExemple(valeur) {
  if (!valeur) {
    return true;
  }

  return valeur.includes("changez") || valeur.includes("exemple");
}

const secretJwt = estValeurExemple(process.env.JWT_SECRET)
  ? genererSecretTemporaire()
  : process.env.JWT_SECRET;

const configuration = {
  port: Number(process.env.PORT) || 3000,
  baseDeDonnees: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    nom: process.env.DB_NAME || "bibliotheque_db",
    utilisateur: process.env.DB_USER || "root",
    motDePasse: process.env.DB_PASSWORD || "",
  },
  authentification: {
    secretJwt,
    secretTemporaire: estValeurExemple(process.env.JWT_SECRET),
    emailAdmin: process.env.ADMIN_EMAIL || "",
    motDePasseAdmin: process.env.ADMIN_MOT_DE_PASSE || "",
    nomCompletAdmin:
      process.env.ADMIN_NOM_COMPLET || "Administrateur principal",
  },
};

module.exports = configuration;
