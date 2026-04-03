const { Op } = require("sequelize");
const { Auteur, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

async function listerAuteurs(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.nom) {
      where.nom = {
        [Op.like]: `%${req.query.nom}%`,
      };
    }

    const resultat = await Auteur.findAndCountAll({
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
      message: "Erreur pendant la recuperation des auteurs.",
      erreur: error.message,
    });
  }
}

async function obtenirAuteur(req, res) {
  try {
    const auteur = await Auteur.findByPk(req.params.id, {
      include: [
        {
          model: Livre,
          as: "livres",
        },
      ],
    });

    if (!auteur) {
      return res.status(404).json({
        message: "Auteur introuvable.",
      });
    }

    return res.json(auteur);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation de l'auteur.",
      erreur: error.message,
    });
  }
}

async function creerAuteur(req, res) {
  try {
    const auteur = await Auteur.create(req.body);

    return res.status(201).json({
      message: "Auteur cree avec succes.",
      auteur,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation de l'auteur.",
      erreur: error.message,
    });
  }
}

async function modifierAuteur(req, res) {
  try {
    const auteur = await Auteur.findByPk(req.params.id);

    if (!auteur) {
      return res.status(404).json({
        message: "Auteur introuvable.",
      });
    }

    await auteur.update(req.body);

    return res.json({
      message: "Auteur modifie avec succes.",
      auteur,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de l'auteur.",
      erreur: error.message,
    });
  }
}

async function supprimerAuteur(req, res) {
  try {
    const auteur = await Auteur.findByPk(req.params.id);

    if (!auteur) {
      return res.status(404).json({
        message: "Auteur introuvable.",
      });
    }

    await auteur.destroy();

    return res.json({
      message: "Auteur supprime avec succes.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la suppression de l'auteur.",
      erreur: error.message,
    });
  }
}

module.exports = {
  listerAuteurs,
  obtenirAuteur,
  creerAuteur,
  modifierAuteur,
  supprimerAuteur,
};
