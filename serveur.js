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

// Configuration de base d'Express
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

// Brancher tous les groupes de routes de l'API.
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

async function initialiserRolesEtAdmin() {
  // On s'assure que les deux roles principaux existent toujours.
  const [roleAdmin] = await Role.findOrCreate({
    where: { nom: "admin" },
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

  const emailAdmin = configuration.authentification.emailAdmin;
  const motDePasseAdmin = configuration.authentification.motDePasseAdmin;

  // Si rien n'est prevu dans .env, on ne cree pas d'admin automatiquement.
  if (!emailAdmin || !motDePasseAdmin) {
    return;
  }

  // Si un email et un mot de passe admin sont donnes dans .env,
  // on cree l'admin une seule fois au demarrage.
  const adminExistant = await Utilisateur.findOne({
    where: { email: emailAdmin },
  });

  if (!adminExistant) {
    // Le mot de passe de l'admin est hash avant d'etre enregistre.
    const motDePasseHash = await bcrypt.hash(motDePasseAdmin, 10);

    await Utilisateur.create({
      nomComplet: configuration.authentification.nomCompletAdmin,
      email: emailAdmin,
      motDePasse: motDePasseHash,
      roleId: roleAdmin.id,
      actif: true,
    });
  }
}

async function demarrerServeur() {
  try {
    if (configuration.authentification.secretTemporaire) {
      console.warn(
        "JWT_SECRET absent ou trop faible. Un secret temporaire a ete genere pour cette session."
      );
    }

    // Verifier l'acces a MySQL avant de lancer le serveur.
    await sequelize.authenticate();

    // Creer les tables manquantes si besoin.
    await sequelize.sync();

    // Ajouter les roles de base et l'admin de demarrage.
    await initialiserRolesEtAdmin();

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
