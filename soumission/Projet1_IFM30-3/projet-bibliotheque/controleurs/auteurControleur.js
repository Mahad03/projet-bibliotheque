const { Op } = require("sequelize");
const { Auteur, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

// Lister les auteurs avec une recherche simple par nom.
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

// Recuperer un auteur et la liste de ses livres.
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

// Ajouter un nouvel auteur.
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

// Modifier les informations d'un auteur existant.
async function modifierAuteur(req, res) {
  try {
    const auteur = await Auteur.findByPk(req.params.id);

    if (!auteur) {
      return res.status(404).json({
        message: "Auteur introuvable.",
      });
    }

    const donnees = {};

    if (req.body.nom !== undefined) {
      donnees.nom = req.body.nom;
    }

    if (req.body.prenom !== undefined) {
      donnees.prenom = req.body.prenom;
    }

    if (req.body.biographie !== undefined) {
      donnees.biographie = req.body.biographie;
    }

    await auteur.update(donnees);

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

// Supprimer un auteur par son identifiant.
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
