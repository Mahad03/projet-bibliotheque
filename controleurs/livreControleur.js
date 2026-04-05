const { Op } = require("sequelize");
const { Auteur, Categorie, Livre } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

// Lister les livres avec pagination et filtres simples.
async function listerLivres(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    // Chaque filtre est optionnel et s'ajoute seulement s'il est present.
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
    });
  }
}

// Recuperer un seul livre avec son auteur et sa categorie.
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
    });
  }
}

// Creer un livre apres verification de l'auteur et de la categorie.
async function creerLivre(req, res) {
  try {
    // Recuperer les champs du body pour garder la creation explicite.
    const titre = req.body.titre;
    const resume = req.body.resume || null;
    const anneePublication = req.body.anneePublication || null;
    const isbn = req.body.isbn;
    const auteurId = req.body.auteurId;
    const categorieId = req.body.categorieId;

    // Le livre doit toujours etre relie a un auteur et une categorie existants.
    const auteur = await Auteur.findByPk(auteurId);
    const categorie = await Categorie.findByPk(categorieId);

    if (!auteur || !categorie) {
      return res.status(404).json({
        message: "L'auteur ou la categorie est introuvable.",
      });
    }

    // Si la quantite disponible n'est pas envoyee, on la cale sur la quantite totale.
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
      titre,
      resume,
      anneePublication,
      isbn,
      auteurId,
      categorieId,
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
    });
  }
}

// Modifier un livre existant sans perdre les quantites.
async function modifierLivre(req, res) {
  try {
    const livre = await Livre.findByPk(req.params.id);

    if (!livre) {
      return res.status(404).json({
        message: "Livre introuvable.",
      });
    }

    // Si l'auteur ou la categorie changent, on verifie que les nouveaux ids existent.
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

    // On reconstruit un objet simple avec seulement les champs a modifier.
    const donnees = {};

    if (req.body.titre !== undefined) {
      donnees.titre = req.body.titre;
    }

    if (req.body.resume !== undefined) {
      donnees.resume = req.body.resume;
    }

    if (req.body.anneePublication !== undefined) {
      donnees.anneePublication = req.body.anneePublication;
    }

    if (req.body.isbn !== undefined) {
      donnees.isbn = req.body.isbn;
    }

    if (req.body.auteurId !== undefined) {
      donnees.auteurId = req.body.auteurId;
    }

    if (req.body.categorieId !== undefined) {
      donnees.categorieId = req.body.categorieId;
    }

    donnees.quantiteTotale = quantiteTotale;
    donnees.quantiteDisponible = quantiteDisponible;

    await livre.update(donnees);

    return res.json({
      message: "Livre modifie avec succes.",
      livre,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la modification du livre.",
    });
  }
}

// Supprimer un livre par son identifiant.
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
