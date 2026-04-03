const bcrypt = require("bcryptjs");
const { Role, Utilisateur } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

async function listerUtilisateurs(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.email) {
      where.email = req.query.email;
    }

    if (req.query.actif === "true") {
      where.actif = true;
    }

    if (req.query.actif === "false") {
      where.actif = false;
    }

    const resultat = await Utilisateur.findAndCountAll({
      where,
      attributes: { exclude: ["motDePasse"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "nom"],
        },
      ],
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    return res.json({
      page,
      limit,
      total: resultat.count,
      donnees: resultat.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation des utilisateurs.",
      erreur: error.message,
    });
  }
}

async function obtenirUtilisateur(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id, {
      attributes: { exclude: ["motDePasse"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "nom"],
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
      message: "Erreur pendant la recuperation de l'utilisateur.",
      erreur: error.message,
    });
  }
}

async function modifierUtilisateur(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    const donnees = { ...req.body };

    if (donnees.motDePasse) {
      donnees.motDePasse = await bcrypt.hash(donnees.motDePasse, 10);
    }

    if (donnees.roleId) {
      const role = await Role.findByPk(donnees.roleId);

      if (!role) {
        return res.status(404).json({
          message: "Le role demande est introuvable.",
        });
      }
    }

    await utilisateur.update(donnees);

    const utilisateurMisAJour = await Utilisateur.findByPk(utilisateur.id, {
      attributes: { exclude: ["motDePasse"] },
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "nom"],
        },
      ],
    });

    return res.json({
      message: "Utilisateur modifie avec succes.",
      utilisateur: utilisateurMisAJour,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de l'utilisateur.",
      erreur: error.message,
    });
  }
}

async function supprimerUtilisateur(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    await utilisateur.destroy();

    return res.json({
      message: "Utilisateur supprime avec succes.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la suppression de l'utilisateur.",
      erreur: error.message,
    });
  }
}

module.exports = {
  listerUtilisateurs,
  obtenirUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
};
