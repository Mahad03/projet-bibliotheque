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
      erreur: error.message,
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
      erreur: error.message,
    });
  }
}

async function creerRole(req, res) {
  try {
    const role = await Role.create(req.body);

    return res.status(201).json({
      message: "Role cree avec succes.",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation du role.",
      erreur: error.message,
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

    await role.update(req.body);

    return res.json({
      message: "Role modifie avec succes.",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification du role.",
      erreur: error.message,
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
      erreur: error.message,
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
