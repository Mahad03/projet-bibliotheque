const { Op } = require("sequelize");
const { Auteur, Categorie, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

async function listerLivres(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.titre) {
      where.titre = {
        [Op.like]: `%${req.query.titre}%`,
      };
    }

    if (req.query.auteurId) {
      where.auteurId = req.query.auteurId;
    }

    if (req.query.categorieId) {
      where.categorieId = req.query.categorieId;
    }

    if (req.query.disponible === "true") {
      where.quantiteDisponible = {
        [Op.gt]: 0,
      };
    }

    const resultat = await Livre.findAndCountAll({
      where,
      include: [
        {
          model: Auteur,
          as: "auteur",
          attributes: ["id", "nom", "prenom"],
        },
        {
          model: Categorie,
          as: "categorie",
          attributes: ["id", "nom"],
        },
      ],
      limit,
      offset,
      order: [["titre", "ASC"]],
    });

    return res.json({
      page,
      limit,
      total: resultat.count,
      donnees: resultat.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation des livres.",
      erreur: error.message,
    });
  }
}

async function obtenirLivre(req, res) {
  try {
    const livre = await Livre.findByPk(req.params.id, {
      include: [
        {
          model: Auteur,
          as: "auteur",
          attributes: ["id", "nom", "prenom", "biographie"],
        },
        {
          model: Categorie,
          as: "categorie",
          attributes: ["id", "nom", "description"],
        },
      ],
    });

    if (!livre) {
      return res.status(404).json({
        message: "Livre introuvable.",
      });
    }

    return res.json(livre);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation du livre.",
      erreur: error.message,
    });
  }
}

async function creerLivre(req, res) {
  try {
    const auteur = await Auteur.findByPk(req.body.auteurId);
    const categorie = await Categorie.findByPk(req.body.categorieId);

    if (!auteur || !categorie) {
      return res.status(404).json({
        message: "L'auteur ou la categorie est introuvable.",
      });
    }

    const quantiteTotale = Number(req.body.quantiteTotale || 1);
    const quantiteDisponible = Number(
      req.body.quantiteDisponible ?? quantiteTotale
    );

    if (quantiteDisponible > quantiteTotale) {
      return res.status(400).json({
        message:
          "La quantite disponible ne peut pas etre plus grande que la quantite totale.",
      });
    }

    const livre = await Livre.create({
      ...req.body,
      quantiteTotale,
      quantiteDisponible,
    });

    return res.status(201).json({
      message: "Livre cree avec succes.",
      livre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation du livre.",
      erreur: error.message,
    });
  }
}

async function modifierLivre(req, res) {
  try {
    const livre = await Livre.findByPk(req.params.id);

    if (!livre) {
      return res.status(404).json({
        message: "Livre introuvable.",
      });
    }

    if (req.body.auteurId) {
      const auteur = await Auteur.findByPk(req.body.auteurId);

      if (!auteur) {
        return res.status(404).json({
          message: "Auteur introuvable.",
        });
      }
    }

    if (req.body.categorieId) {
      const categorie = await Categorie.findByPk(req.body.categorieId);

      if (!categorie) {
        return res.status(404).json({
          message: "Categorie introuvable.",
        });
      }
    }

    const quantiteTotale = Number(
      req.body.quantiteTotale ?? livre.quantiteTotale
    );
    const quantiteDisponible = Number(
      req.body.quantiteDisponible ?? livre.quantiteDisponible
    );

    if (quantiteDisponible > quantiteTotale) {
      return res.status(400).json({
        message:
          "La quantite disponible ne peut pas etre plus grande que la quantite totale.",
      });
    }

    await livre.update({
      ...req.body,
      quantiteTotale,
      quantiteDisponible,
    });

    return res.json({
      message: "Livre modifie avec succes.",
      livre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification du livre.",
      erreur: error.message,
    });
  }
}

async function supprimerLivre(req, res) {
  try {
    const livre = await Livre.findByPk(req.params.id);

    if (!livre) {
      return res.status(404).json({
        message: "Livre introuvable.",
      });
    }

    await livre.destroy();

    return res.json({
      message: "Livre supprime avec succes.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la suppression du livre.",
      erreur: error.message,
    });
  }
}

module.exports = {
  listerLivres,
  obtenirLivre,
  creerLivre,
  modifierLivre,
  supprimerLivre,
};
