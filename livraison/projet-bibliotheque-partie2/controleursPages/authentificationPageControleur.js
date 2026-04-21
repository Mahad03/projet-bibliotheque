const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");
const { Role, Utilisateur } = require("../modeles");
const { extraireErreurs } = require("../utilitaires/pages");

function creerJeton(utilisateur, roleNom) {
  return jwt.sign(
    {
      id: utilisateur.id,
      nomComplet: utilisateur.nomComplet,
      email: utilisateur.email,
      roleNom,
    },
    configuration.authentification.secretJeton,
    { expiresIn: "7d" }
  );
}

function afficherConnexion(req, res) {
  if (req.utilisateurInterface) {
    return res.redirect("/tableau-de-bord");
  }

  return res.render("authentification/connexion", {
    titre: "Connexion",
    pageActive: "connexion",
    erreurs: {},
    donnees: {
      email: "",
    },
  });
}

function afficherInscription(req, res) {
  if (req.utilisateurInterface) {
    return res.redirect("/tableau-de-bord");
  }

  return res.render("authentification/inscription", {
    titre: "Inscription",
    pageActive: "inscription",
    erreurs: {},
    donnees: {
      nomComplet: "",
      email: "",
    },
  });
}

async function traiterConnexion(req, res) {
  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("authentification/connexion", {
      titre: "Connexion",
      pageActive: "connexion",
      erreurs,
      donnees: {
        email: req.body.email || "",
      },
    });
  }

  const utilisateur = await Utilisateur.findOne({
    where: { email: req.body.email },
    include: [{ model: Role, as: "role" }],
  });

  if (!utilisateur) {
    return res.status(401).render("authentification/connexion", {
      titre: "Connexion",
      pageActive: "connexion",
      erreurs: {
        email: "Email ou mot de passe incorrect.",
      },
      donnees: {
        email: req.body.email || "",
      },
    });
  }

  const motDePasseValide = await bcrypt.compare(
    req.body.motDePasse,
    utilisateur.motDePasse
  );

  if (!motDePasseValide) {
    return res.status(401).render("authentification/connexion", {
      titre: "Connexion",
      pageActive: "connexion",
      erreurs: {
        email: "Email ou mot de passe incorrect.",
      },
      donnees: {
        email: req.body.email || "",
      },
    });
  }

  if (!utilisateur.actif) {
    return res.status(403).render("authentification/connexion", {
      titre: "Connexion",
      pageActive: "connexion",
      erreurs: {
        email: "Ce compte est desactive.",
      },
      donnees: {
        email: req.body.email || "",
      },
    });
  }

  const jeton = creerJeton(utilisateur, utilisateur.role.nom);

  res.cookie("jetonInterface", jeton, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.redirect("/tableau-de-bord?succes=Connexion reussie.");
}

async function traiterInscription(req, res) {
  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("authentification/inscription", {
      titre: "Inscription",
      pageActive: "inscription",
      erreurs,
      donnees: {
        nomComplet: req.body.nomComplet || "",
        email: req.body.email || "",
      },
    });
  }

  const utilisateurExistant = await Utilisateur.findOne({
    where: { email: req.body.email },
  });

  if (utilisateurExistant) {
    return res.status(409).render("authentification/inscription", {
      titre: "Inscription",
      pageActive: "inscription",
      erreurs: {
        email: "Un compte existe deja avec cet email.",
      },
      donnees: {
        nomComplet: req.body.nomComplet || "",
        email: req.body.email || "",
      },
    });
  }

  const [roleMembre] = await Role.findOrCreate({
    where: { nom: "membre" },
    defaults: {
      description: "Utilisateur standard",
    },
  });

  const motDePasseHash = await bcrypt.hash(req.body.motDePasse, 10);

  const utilisateur = await Utilisateur.create({
    nomComplet: req.body.nomComplet,
    email: req.body.email,
    motDePasse: motDePasseHash,
    roleId: roleMembre.id,
    actif: true,
  });

  const jeton = creerJeton(utilisateur, roleMembre.nom);

  res.cookie("jetonInterface", jeton, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.redirect("/tableau-de-bord?succes=Inscription reussie.");
}

function deconnexion(req, res) {
  res.clearCookie("jetonInterface");
  return res.redirect("/?succes=Vous etes maintenant deconnecte.");
}

module.exports = {
  afficherConnexion,
  afficherInscription,
  traiterConnexion,
  traiterInscription,
  deconnexion,
};
