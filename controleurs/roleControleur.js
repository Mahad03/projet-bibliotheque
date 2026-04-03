const { Role } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

async function listerRoles(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.nom) {
      where.nom = req.query.nom;
    }

    const resultat = await Role.findAndCountAll({
      where,
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
      message: "Erreur pendant la recuperation des roles.",
    });
  }
}

async function obtenirRole(req, res) {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role introuvable.",
      });
    }

    return res.json(role);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation du role.",
    });
  }
}

async function creerRole(req, res) {
  try {
    const nom = req.body.nom;
    const description = req.body.description || null;

    const role = await Role.create({
      nom,
      description,
    });

    return res.status(201).json({
      message: "Role cree avec succes.",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation du role.",
    });
  }
}

async function modifierRole(req, res) {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role introuvable.",
      });
    }

    const donneesRole = {};

    if (req.body.nom !== undefined) {
      donneesRole.nom = req.body.nom;
    }

    if (req.body.description !== undefined) {
      donneesRole.description = req.body.description;
    }

    await role.update(donneesRole);

    return res.json({
      message: "Role modifie avec succes.",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification du role.",
    });
  }
}

async function supprimerRole(req, res) {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: "Role introuvable.",
      });
    }

    await role.destroy();

    return res.json({
      message: "Role supprime avec succes.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la suppression du role.",
    });
  }
}

module.exports = {
  listerRoles,
  obtenirRole,
  creerRole,
  modifierRole,
  supprimerRole,
};
