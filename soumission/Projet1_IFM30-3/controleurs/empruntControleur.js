const { Emprunt, Livre, Role, Utilisateur } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

function ajouterJours(dateTexte, nombreDeJours) {
  const date = new Date(dateTexte);
  date.setDate(date.getDate() + nombreDeJours);
  return date.toISOString().split("T")[0];
}

async function creerEmprunt(req, res) {
  try {
    const utilisateur = await Utilisateur.findByPk(req.utilisateur.id);
    const livre = await Livre.findByPk(req.body.livreId);

    if (!utilisateur) {
      return res.status(404).json({
        message: "Utilisateur introuvable.",
      });
    }

    if (!utilisateur.actif) {
      return res.status(403).json({
        message: "Votre compte est desactive.",
      });
    }

    if (!livre) {
      return res.status(404).json({
        message: "Livre introuvable.",
      });
    }

    if (livre.quantiteDisponible <= 0) {
      return res.status(400).json({
        message: "Ce livre n'est plus disponible.",
      });
    }

    const aujourdHui = new Date().toISOString().split("T")[0];

    const emprunt = await Emprunt.create({
      utilisateurId: utilisateur.id,
      livreId: livre.id,
      dateEmprunt: aujourdHui,
      dateRetourPrevue: ajouterJours(aujourdHui, 14),
    });

    await livre.update({
      quantiteDisponible: livre.quantiteDisponible - 1,
    });

    return res.status(201).json({
      message: "Emprunt cree avec succes.",
      emprunt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la creation de l'emprunt.",
      erreur: error.message,
    });
  }
}

async function listerMesEmprunts(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {
      utilisateurId: req.utilisateur.id,
    };

    if (req.query.statut) {
      where.statut = req.query.statut;
    }

    const resultat = await Emprunt.findAndCountAll({
      where,
      include: [
        {
          model: Livre,
          as: "livre",
          attributes: ["id", "titre", "isbn"],
        },
      ],
      limit,
      offset,
      order: [["dateEmprunt", "DESC"]],
    });

    return res.json({
      page,
      limit,
      total: resultat.count,
      donnees: resultat.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation de vos emprunts.",
      erreur: error.message,
    });
  }
}

async function listerEmprunts(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    if (req.query.statut) {
      where.statut = req.query.statut;
    }

    if (req.query.utilisateurId) {
      where.utilisateurId = req.query.utilisateurId;
    }

    const resultat = await Emprunt.findAndCountAll({
      where,
      include: [
        {
          model: Utilisateur,
          as: "utilisateur",
          attributes: ["id", "nomComplet", "email"],
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["nom"],
            },
          ],
        },
        {
          model: Livre,
          as: "livre",
          attributes: ["id", "titre", "isbn"],
        },
      ],
      limit,
      offset,
      order: [["dateEmprunt", "DESC"]],
    });

    return res.json({
      page,
      limit,
      total: resultat.count,
      donnees: resultat.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant la recuperation des emprunts.",
      erreur: error.message,
    });
  }
}

async function retournerEmprunt(req, res) {
  try {
    const emprunt = await Emprunt.findByPk(req.params.id, {
      include: [
        {
          model: Livre,
          as: "livre",
        },
      ],
    });

    if (!emprunt) {
      return res.status(404).json({
        message: "Emprunt introuvable.",
      });
    }

    const estAdmin = req.utilisateur.roleNom === "admin";
    const estProprietaire = emprunt.utilisateurId === req.utilisateur.id;

    if (!estAdmin && !estProprietaire) {
      return res.status(403).json({
        message: "Vous ne pouvez pas modifier cet emprunt.",
      });
    }

    if (emprunt.statut === "retourne") {
      return res.status(400).json({
        message: "Cet emprunt a deja ete retourne.",
      });
    }

    const dateRetourEffective = new Date().toISOString().split("T")[0];

    await emprunt.update({
      statut: "retourne",
      dateRetourEffective,
    });

    await emprunt.livre.update({
      quantiteDisponible: emprunt.livre.quantiteDisponible + 1,
    });

    return res.json({
      message: "Le retour du livre a ete enregistre.",
      emprunt,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur pendant le retour du livre.",
      erreur: error.message,
    });
  }
}

module.exports = {
  creerEmprunt,
  listerMesEmprunts,
  listerEmprunts,
  retournerEmprunt,
};
