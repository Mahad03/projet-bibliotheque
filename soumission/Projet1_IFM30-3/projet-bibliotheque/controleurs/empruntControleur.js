const { Emprunt, Livre, Role, Utilisateur } = require("../modeles");
const obtenirPagination = require("../utilitaires/pagination");

function ajouterJours(dateTexte, nombreDeJours) {
  const date = new Date(dateTexte);
  date.setDate(date.getDate() + nombreDeJours);
  return date.toISOString().split("T")[0];
}

// Creer un emprunt si l'utilisateur et le livre sont valides.
async function creerEmprunt(req, res) {
  try {
    // Recuperer l'utilisateur connecte et le livre demande.
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

    // Verifier qu'il reste encore des exemplaires disponibles.
    if (livre.quantiteDisponible <= 0) {
      return res.status(400).json({
        message: "Ce livre n'est plus disponible.",
      });
    }

    // La date de retour prevue est fixee a 14 jours apres l'emprunt.
    const aujourdHui = new Date().toISOString().split("T")[0];

    const emprunt = await Emprunt.create({
      utilisateurId: utilisateur.id,
      livreId: livre.id,
      dateEmprunt: aujourdHui,
      dateRetourPrevue: ajouterJours(aujourdHui, 14),
    });

    // Quand un emprunt est cree, on diminue le stock disponible.
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
    });
  }
}

// Afficher seulement les emprunts de l'utilisateur connecte.
async function listerMesEmprunts(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);

    // Un membre ne peut voir que ses propres emprunts.
    const where = {
      utilisateurId: req.utilisateur.id,
    };

    // Le statut reste optionnel: en_cours ou retourne.
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
    });
  }
}

// Afficher tous les emprunts pour l'administrateur.
async function listerEmprunts(req, res) {
  try {
    const { page, limit, offset } = obtenirPagination(req.query);
    const where = {};

    // L'administrateur peut filtrer la liste globale.
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
    });
  }
}

// Marquer un emprunt comme retourne et remettre le livre en stock.
async function retournerEmprunt(req, res) {
  try {
    // Charger aussi le livre lie pour remettre le stock a jour.
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

    // Seul l'administrateur ou le proprietaire de l'emprunt peut faire le retour.
    const estAdministrateur = req.utilisateur.roleNom === "administrateur";
    const estProprietaire = emprunt.utilisateurId === req.utilisateur.id;

    if (!estAdministrateur && !estProprietaire) {
      return res.status(403).json({
        message: "Vous ne pouvez pas modifier cet emprunt.",
      });
    }

    // Empecher un double retour du meme emprunt.
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

    // Quand le livre revient, on remet une unite dans le stock disponible.
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
    });
  }
}

module.exports = {
  creerEmprunt,
  listerMesEmprunts,
  listerEmprunts,
  retournerEmprunt,
};
