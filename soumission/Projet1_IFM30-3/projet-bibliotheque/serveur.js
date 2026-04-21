const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const configuration = require("./configuration/environnement");
const { Role, Utilisateur, sequelize } = require("./modeles");

const routesAuthentification = require("./routes/routesAuthentification");
const routesRoles = require("./routes/routesRoles");
const routesUtilisateurs = require("./routes/routesUtilisateurs");
const routesAuteurs = require("./routes/routesAuteurs");
const routesCategories = require("./routes/routesCategories");
const routesLivres = require("./routes/routesLivres");
const routesEmprunts = require("./routes/routesEmprunts");

const app = express();
const PORT = configuration.port;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API de bibliotheque active.",
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API de gestion de bibliotheque.",
    routes: [
      "/api/authentification",
      "/api/roles",
      "/api/utilisateurs",
      "/api/auteurs",
      "/api/categories",
      "/api/livres",
      "/api/emprunts",
    ],
  });
});

app.use("/api/authentification", routesAuthentification);
app.use("/api/roles", routesRoles);
app.use("/api/utilisateurs", routesUtilisateurs);
app.use("/api/auteurs", routesAuteurs);
app.use("/api/categories", routesCategories);
app.use("/api/livres", routesLivres);
app.use("/api/emprunts", routesEmprunts);

app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable.",
  });
});

async function initialiserRolesEtAdministrateur() {
  const [roleAdministrateur] = await Role.findOrCreate({
    where: { nom: "administrateur" },
    defaults: {
      description: "Administrateur de l'application",
    },
  });

  await Role.findOrCreate({
    where: { nom: "membre" },
    defaults: {
      description: "Utilisateur standard",
    },
  });

  const courrielAdministrateur =
    configuration.authentification.courrielAdministrateur;
  const motDePasseAdministrateur =
    configuration.authentification.motDePasseAdministrateur;

  if (!courrielAdministrateur || !motDePasseAdministrateur) {
    return;
  }

  const administrateurExistant = await Utilisateur.findOne({
    where: { email: courrielAdministrateur },
  });

  if (!administrateurExistant) {
    const motDePasseHash = await bcrypt.hash(motDePasseAdministrateur, 10);

    await Utilisateur.create({
      nomComplet: configuration.authentification.nomCompletAdministrateur,
      email: courrielAdministrateur,
      motDePasse: motDePasseHash,
      roleId: roleAdministrateur.id,
      actif: true,
    });
  }
}

async function demarrerServeur() {
  try {
    if (configuration.authentification.secretTemporaire) {
      console.warn(
        "SECRET_JETON absent ou trop faible. Un secret temporaire a ete genere pour cette session."
      );
    }

    await sequelize.authenticate();
    await sequelize.sync();
    await initialiserRolesEtAdministrateur();

    app.listen(PORT, () => {
      console.log("Serveur demarre sur http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("Erreur au demarrage du serveur :", error.message);
  }
}

if (require.main === module) {
  demarrerServeur();
}

module.exports = {
  app,
  demarrerServeur,
};
