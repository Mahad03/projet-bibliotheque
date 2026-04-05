const bcrypt = require("bcryptjs");
const { Role, Utilisateur } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

// Lister les utilisateurs avec filtres simples et pagination.
async function listerUtilisateurs(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    // Ces filtres restent simples pour garder la route facile a utiliser.
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
    });
  }
}

// Recuperer un utilisateur precis sans son mot de passe.
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
    });
  }
}

// Modifier un utilisateur et hacher le mot de passe si besoin.
async function modifierUtilisateur(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.params.id);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    // Copier seulement les champs autorises pour eviter de tout remplacer.
    const donnees = {};

    if (req.body.nomComplet !== undefined) {
      donnees.nomComplet = req.body.nomComplet;
    }

    if (req.body.email !== undefined) {
      donnees.email = req.body.email;
    }

    if (req.body.actif !== undefined) {
      donnees.actif = req.body.actif;
    }

    if (req.body.roleId !== undefined) {
      donnees.roleId = req.body.roleId;
    }

    if (req.body.motDePasse !== undefined) {
      donnees.motDePasse = req.body.motDePasse;
    }

    // Si un nouveau mot de passe est fourni, on le hash avant la sauvegarde.
    if (donnees.motDePasse) {
      donnees.motDePasse = await bcrypt.hash(donnees.motDePasse, 10);
    }

    // Verifier le role seulement si l'id du role change.
    if (donnees.roleId) {
      const role = await Role.findByPk(donnees.roleId);

      if (!role) {
        return res.status(404).json({
          message: "Le role demande est introuvable.",
        });
      }
    }

    await utilisateur.update(donnees);

    // Relire l'utilisateur pour retourner une version propre sans mot de passe.
    const utilisateurModifie = await Utilisateur.findByPk(utilisateur.id, {
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
      utilisateur: utilisateurModifie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de l'utilisateur.",
    });
  }
}

// Supprimer un utilisateur par son identifiant.
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
    });
  }
}

module.exports = {
  listerUtilisateurs,
  obtenirUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
};
