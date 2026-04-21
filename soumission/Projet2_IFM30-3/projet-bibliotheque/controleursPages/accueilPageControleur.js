const { Auteur, Categorie, Emprunt, Livre, Utilisateur } = require("../modeles");

async function afficherAccueil(req, res) {
  const [nombreLivres, nombreAuteurs, nombreCategories, derniersLivres] =
    await Promise.all([
      Livre.count(),
      Auteur.count(),
      Categorie.count(),
      Livre.findAll({
        include: [
          { model: Auteur, as: "auteur", attributes: ["nom", "prenom"] },
          { model: Categorie, as: "categorie", attributes: ["nom"] },
        ],
        order: [["createdAt", "DESC"]],
        limit: 6,
      }),
    ]);

  return res.render("accueil", {
    titre: "Accueil",
    pageActive: "accueil",
    statistiques: {
      nombreLivres,
      nombreAuteurs,
      nombreCategories,
    },
    derniersLivres,
  });
}

async function afficherTableauDeBord(req, res) {
  const estAdministrateur = req.utilisateurInterface.role.nom === "administrateur";
  let empruntsEnCours = 0;
  let nombreUtilisateurs = 0;
  let mesEmprunts = [];

  if (estAdministrateur) {
    [empruntsEnCours, nombreUtilisateurs] = await Promise.all([
      Emprunt.count({ where: { statut: "en_cours" } }),
      Utilisateur.count(),
    ]);
  } else {
    mesEmprunts = await Emprunt.findAll({
      where: { utilisateurId: req.utilisateurInterface.id },
      include: [{ model: Livre, as: "livre", attributes: ["titre"] }],
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
  }

  return res.render("tableau-de-bord", {
    titre: "Tableau de bord",
    pageActive: "tableau-de-bord",
    estAdministrateur,
    indicateurs: {
      empruntsEnCours,
      nombreUtilisateurs,
    },
    mesEmprunts,
  });
}

module.exports = {
  afficherAccueil,
  afficherTableauDeBord,
};
