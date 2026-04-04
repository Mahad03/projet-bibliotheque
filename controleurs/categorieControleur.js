const { Op } = require("sequelize");
const { Categorie, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

// Lister les categories avec une recherche simple par nom.
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
    });
  }
}

// Recuperer une categorie et les livres qui lui sont lies.
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
    });
  }
}

// Ajouter une nouvelle categorie.
async function creerCategorie(req, res) {
  try {
    const nom = req.body.nom;
    const description = req.body.description || null;

    const categorie = await Categorie.create({
      nom,
      description,
    });

    return res.status(201).json({
      message: "Categorie creee avec succes.",
      categorie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation de la categorie.",
    });
  }
}

// Modifier une categorie existante.
async function modifierCategorie(req, res) {
  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Categorie introuvable.",
      });
    }

    const donneesCategorie = {};

    if (req.body.nom !== undefined) {
      donneesCategorie.nom = req.body.nom;
    }

    if (req.body.description !== undefined) {
      donneesCategorie.description = req.body.description;
    }

    await categorie.update(donneesCategorie);

    return res.json({
      message: "Categorie modifiee avec succes.",
      categorie,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de la categorie.",
    });
  }
}

// Supprimer une categorie par son identifiant.
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
