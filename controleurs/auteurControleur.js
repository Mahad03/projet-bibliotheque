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
    });
  }
}

async function creerAuteur(req, res) {
  try {
    const nom = req.body.nom;
    const prenom = req.body.prenom || null;
    const biographie = req.body.biographie || null;

    const auteur = await Auteur.create({
      nom,
      prenom,
      biographie,
    });

    return res.status(201).json({
      message: "Auteur cree avec succes.",
      auteur,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation de l'auteur.",
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

    const donneesAuteur = {};

    if (req.body.nom !== undefined) {
      donneesAuteur.nom = req.body.nom;
    }

    if (req.body.prenom !== undefined) {
      donneesAuteur.prenom = req.body.prenom;
    }

    if (req.body.biographie !== undefined) {
      donneesAuteur.biographie = req.body.biographie;
    }

    await auteur.update(donneesAuteur);

    return res.json({
      message: "Auteur modifie avec succes.",
      auteur,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification de l'auteur.",
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
