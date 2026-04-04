const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const configuration = require("../configuration/environnement");
const { Role, Utilisateur } = require("../modeles");

function creerToken(utilisateur, roleNom) {
  return jwt.sign(
    {
      id: utilisateur.id,
      nomComplet: utilisateur.nomComplet,
      email: utilisateur.email,
      roleNom,
    },
    configuration.authentification.secretJwt,
    { expiresIn: "7d" }
  );
}

// Inscrire un nouveau membre avec le role "membre" par defaut.
async function inscription(req, res) {
  try {
    const { nomComplet, email, motDePasse } = req.body;

    const utilisateurExistant = await Utilisateur.findOne({
      where: { email },
    });

    if (utilisateurExistant) {
      return res.status(409).json({
        message: "Un utilisateur avec cet email existe deja.",
      });
    }

    const [roleMembre] = await Role.findOrCreate({
      where: { nom: "membre" },
      defaults: {
        description: "Role par defaut pour les membres",
      },
    });

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await Utilisateur.create({
      nomComplet,
      email,
      motDePasse: motDePasseHash,
      roleId: roleMembre.id,
    });

    const token = creerToken(utilisateur, roleMembre.nom);

    return res.status(201).json({
      message: "Inscription reussie.",
      token,
      utilisateur: {
        id: utilisateur.id,
        nomComplet: utilisateur.nomComplet,
        email: utilisateur.email,
        role: roleMembre.nom,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant l'inscription.",
    });
  }
}

// Verifier les identifiants puis retourner un token JWT.
async function connexion(req, res) {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await Utilisateur.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "role",
        },
      ],
    });

    if (!utilisateur) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    if (!utilisateur.actif) {
      return res.status(403).json({
        message: "Ce compte est desactive.",
      });
    }

    const token = creerToken(utilisateur, utilisateur.role.nom);

    return res.json({
      message: "Connexion reussie.",
      token,
      utilisateur: {
        id: utilisateur.id,
        nomComplet: utilisateur.nomComplet,
        email: utilisateur.email,
        role: utilisateur.role.nom,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la connexion.",
    });
  }
}

// Recuperer les informations du profil de l'utilisateur connecte.
async function profil(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id, {
      attributes: { exclude: ["motDePasse"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "nom", "description"],
        },
      ],
    });

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    return res.json(utilisateur);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation du profil.",
    });
  }
}

module.exports = {
  inscription,
  connexion,
  profil,
};
