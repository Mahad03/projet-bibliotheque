const { Op } = require("sequelize");
const { Categorie, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

async function listerCategories(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.nom) {
      where.nom = {
        [Op.like]: `%${req.query.nom}%`,
      };
    }

    const resultat = await Categorie.findAndCountAll({
      where,
      limit,
      offset,
      order: [["nom", "ASC"]],
    });

    return res.json({
      page,
      limit,
      total: resultat.count,
      donnees: resultat.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation des categories.",
      erreur: error.message,
    });
  }
}

async function obtenirCategorie(req, res) {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [
        {
          model: Livre,
          as: "livres",
        },
      ],
    });

    if (!categorie) {
      return res.status(404).json({
        message: "Categorie introuvable.",
      });
    }

    return res.json(categorie);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation de la categorie.",
      erreur: error.message,
    });
  }
}

async function creerCategorie(req, res) {
  try {
    const categorie = await Categorie.create(req.body);

    return res.status(201).json({
      message: "Categorie creee avec succes.",
      categorie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation de la categorie.",
      erreur: error.message,
    });
  }
}

async function modifierCategorie(req, res) {
  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Categorie introuvable.",
      });
    }

    await categorie.update(req.body);

    return res.json({
      message: "Categorie modifiee avec succes.",
      categorie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de la categorie.",
      erreur: error.message,
    });
  }
}

async function supprimerCategorie(req, res) {
  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Categorie introuvable.",
      });
    }

    await categorie.destroy();

    return res.json({
      message: "Categorie supprimee avec succes.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la suppression de la categorie.",
      erreur: error.message,
    });
  }
}

module.exports = {
  listerCategories,
  obtenirCategorie,
  creerCategorie,
  modifierCategorie,
  supprimerCategorie,
};
