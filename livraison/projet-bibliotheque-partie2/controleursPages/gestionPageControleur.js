const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const {
  Auteur,
  Categorie,
  Emprunt,
  Livre,
  Role,
  Utilisateur,
} = require("../modeles");
const {
  donnerErreurMulter,
  extraireErreurs,
  imageDepuisFichier,
  valeurBooleenne,
} = require("../utilitaires/pages");

function aujourdhui() {
  return new Date().toISOString().split("T")[0];
}

async function listerRoles(req, res) {
  const roles = await Role.findAll({
    order: [["nom", "ASC"]],
  });

  return res.render("roles/liste", {
    titre: "Roles",
    pageActive: "roles",
    roles,
  });
}

function afficherCreationRole(req, res) {
  return res.render("roles/formulaire", {
    titre: "Nouveau role",
    pageActive: "roles",
    mode: "creation",
    erreurs: {},
    donnees: {
      nom: "",
      description: "",
    },
  });
}

async function creerRole(req, res) {
  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("roles/formulaire", {
      titre: "Nouveau role",
      pageActive: "roles",
      mode: "creation",
      erreurs,
      donnees: req.body,
    });
  }

  try {
    await Role.create({
      nom: req.body.nom,
      description: req.body.description || null,
    });

    return res.redirect("/roles?succes=Role cree avec succes.");
  } catch (error) {
    return res.status(400).render("roles/formulaire", {
      titre: "Nouveau role",
      pageActive: "roles",
      mode: "creation",
      erreurs: {
        nom: "Impossible de creer ce role. Le nom existe peut-etre deja.",
      },
      donnees: req.body,
    });
  }
}

async function afficherModificationRole(req, res) {
  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return res.redirect("/roles?erreur=Role introuvable.");
  }

  return res.render("roles/formulaire", {
    titre: "Modifier un role",
    pageActive: "roles",
    mode: "modification",
    erreurs: {},
    donnees: {
      id: role.id,
      nom: role.nom,
      description: role.description || "",
    },
  });
}

async function modifierRole(req, res) {
  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return res.redirect("/roles?erreur=Role introuvable.");
  }

  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("roles/formulaire", {
      titre: "Modifier un role",
      pageActive: "roles",
      mode: "modification",
      erreurs,
      donnees: {
        id: role.id,
        nom: req.body.nom,
        description: req.body.description || "",
      },
    });
  }

  try {
    await role.update({
      nom: req.body.nom,
      description: req.body.description || null,
    });

    return res.redirect("/roles?succes=Role modifie avec succes.");
  } catch (error) {
    return res.status(400).render("roles/formulaire", {
      titre: "Modifier un role",
      pageActive: "roles",
      mode: "modification",
      erreurs: {
        nom: "Impossible de modifier ce role.",
      },
      donnees: {
        id: role.id,
        nom: req.body.nom,
        description: req.body.description || "",
      },
    });
  }
}

async function supprimerRole(req, res) {
  const role = await Role.findByPk(req.params.id);

  if (!role) {
    return res.redirect("/roles?erreur=Role introuvable.");
  }

  try {
    await role.destroy();
    return res.redirect("/roles?succes=Role supprime avec succes.");
  } catch (error) {
    return res.redirect(
      "/roles?erreur=Impossible de supprimer ce role car il est utilise."
    );
  }
}

async function listerUtilisateurs(req, res) {
  const utilisateurs = await Utilisateur.findAll({
    include: [{ model: Role, as: "role", attributes: ["nom"] }],
    order: [["nomComplet", "ASC"]],
  });

  return res.render("utilisateurs/liste", {
    titre: "Utilisateurs",
    pageActive: "utilisateurs",
    utilisateurs,
  });
}

async function afficherCreationUtilisateur(req, res) {
  const roles = await Role.findAll({ order: [["nom", "ASC"]] });

  return res.render("utilisateurs/formulaire", {
    titre: "Nouvel utilisateur",
    pageActive: "utilisateurs",
    mode: "creation",
    erreurs: {},
    roles,
    donnees: {
      nomComplet: "",
      email: "",
      roleId: "",
      actif: true,
    },
  });
}

async function creerUtilisateur(req, res) {
  const erreurs = extraireErreurs(req);
  const roles = await Role.findAll({ order: [["nom", "ASC"]] });

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("utilisateurs/formulaire", {
      titre: "Nouvel utilisateur",
      pageActive: "utilisateurs",
      mode: "creation",
      erreurs,
      roles,
      donnees: {
        ...req.body,
        actif: valeurBooleenne(req.body.actif),
      },
    });
  }

  const utilisateurExistant = await Utilisateur.findOne({
    where: { email: req.body.email },
  });

  if (utilisateurExistant) {
    return res.status(409).render("utilisateurs/formulaire", {
      titre: "Nouvel utilisateur",
      pageActive: "utilisateurs",
      mode: "creation",
      erreurs: {
        email: "Un utilisateur existe deja avec cet email.",
      },
      roles,
      donnees: {
        ...req.body,
        actif: valeurBooleenne(req.body.actif),
      },
    });
  }

  const motDePasseHash = await bcrypt.hash(req.body.motDePasse, 10);

  await Utilisateur.create({
    nomComplet: req.body.nomComplet,
    email: req.body.email,
    motDePasse: motDePasseHash,
    roleId: req.body.roleId,
    actif: valeurBooleenne(req.body.actif),
  });

  return res.redirect("/utilisateurs?succes=Utilisateur cree avec succes.");
}

async function afficherModificationUtilisateur(req, res) {
  const [utilisateur, roles] = await Promise.all([
    Utilisateur.findByPk(req.params.id, {
      attributes: { exclude: ["motDePasse"] },
    }),
    Role.findAll({ order: [["nom", "ASC"]] }),
  ]);

  if (!utilisateur) {
    return res.redirect("/utilisateurs?erreur=Utilisateur introuvable.");
  }

  return res.render("utilisateurs/formulaire", {
    titre: "Modifier un utilisateur",
    pageActive: "utilisateurs",
    mode: "modification",
    erreurs: {},
    roles,
    donnees: {
      id: utilisateur.id,
      nomComplet: utilisateur.nomComplet,
      email: utilisateur.email,
      roleId: utilisateur.roleId,
      actif: utilisateur.actif,
    },
  });
}

async function modifierUtilisateur(req, res) {
  const [utilisateur, roles] = await Promise.all([
    Utilisateur.findByPk(req.params.id),
    Role.findAll({ order: [["nom", "ASC"]] }),
  ]);

  if (!utilisateur) {
    return res.redirect("/utilisateurs?erreur=Utilisateur introuvable.");
  }

  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("utilisateurs/formulaire", {
      titre: "Modifier un utilisateur",
      pageActive: "utilisateurs",
      mode: "modification",
      erreurs,
      roles,
      donnees: {
        id: utilisateur.id,
        ...req.body,
        actif: valeurBooleenne(req.body.actif),
      },
    });
  }

  const autreUtilisateur = await Utilisateur.findOne({
    where: {
      email: req.body.email,
      id: { [Op.ne]: utilisateur.id },
    },
  });

  if (autreUtilisateur) {
    return res.status(409).render("utilisateurs/formulaire", {
      titre: "Modifier un utilisateur",
      pageActive: "utilisateurs",
      mode: "modification",
      erreurs: {
        email: "Un autre utilisateur possede deja cet email.",
      },
      roles,
      donnees: {
        id: utilisateur.id,
        ...req.body,
        actif: valeurBooleenne(req.body.actif),
      },
    });
  }

  const donneesMiseAJour = {
    nomComplet: req.body.nomComplet,
    email: req.body.email,
    roleId: req.body.roleId,
    actif: valeurBooleenne(req.body.actif),
  };

  if (req.body.motDePasse) {
    donneesMiseAJour.motDePasse = await bcrypt.hash(req.body.motDePasse, 10);
  }

  await utilisateur.update(donneesMiseAJour);

  return res.redirect("/utilisateurs?succes=Utilisateur modifie avec succes.");
}

async function supprimerUtilisateur(req, res) {
  const utilisateur = await Utilisateur.findByPk(req.params.id);

  if (!utilisateur) {
    return res.redirect("/utilisateurs?erreur=Utilisateur introuvable.");
  }

  try {
    await utilisateur.destroy();
    return res.redirect("/utilisateurs?succes=Utilisateur supprime avec succes.");
  } catch (error) {
    return res.redirect(
      "/utilisateurs?erreur=Impossible de supprimer cet utilisateur."
    );
  }
}

async function listerAuteurs(req, res) {
  const auteurs = await Auteur.findAll({
    include: [{ model: Livre, as: "livres", attributes: ["id"] }],
    order: [["nom", "ASC"], ["prenom", "ASC"]],
  });

  return res.render("auteurs/liste", {
    titre: "Auteurs",
    pageActive: "auteurs",
    auteurs,
  });
}

function afficherCreationAuteur(req, res) {
  return res.render("auteurs/formulaire", {
    titre: "Nouvel auteur",
    pageActive: "auteurs",
    mode: "creation",
    erreurs: {},
    donnees: {
      nom: "",
      prenom: "",
      biographie: "",
      image: "",
    },
  });
}

async function creerAuteur(req, res) {
  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("auteurs/formulaire", {
      titre: "Nouvel auteur",
      pageActive: "auteurs",
      mode: "creation",
      erreurs,
      donnees: req.body,
    });
  }

  await Auteur.create({
    nom: req.body.nom,
    prenom: req.body.prenom || null,
    biographie: req.body.biographie || null,
    image: imageDepuisFichier(req, null),
  });

  return res.redirect("/auteurs?succes=Auteur cree avec succes.");
}

async function afficherModificationAuteur(req, res) {
  const auteur = await Auteur.findByPk(req.params.id);

  if (!auteur) {
    return res.redirect("/auteurs?erreur=Auteur introuvable.");
  }

  return res.render("auteurs/formulaire", {
    titre: "Modifier un auteur",
    pageActive: "auteurs",
    mode: "modification",
    erreurs: {},
    donnees: auteur.toJSON(),
  });
}

async function modifierAuteur(req, res) {
  const auteur = await Auteur.findByPk(req.params.id);

  if (!auteur) {
    return res.redirect("/auteurs?erreur=Auteur introuvable.");
  }

  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("auteurs/formulaire", {
      titre: "Modifier un auteur",
      pageActive: "auteurs",
      mode: "modification",
      erreurs,
      donnees: {
        id: auteur.id,
        nom: req.body.nom,
        prenom: req.body.prenom,
        biographie: req.body.biographie,
        image: auteur.image,
      },
    });
  }

  await auteur.update({
    nom: req.body.nom,
    prenom: req.body.prenom || null,
    biographie: req.body.biographie || null,
    image: imageDepuisFichier(req, auteur.image),
  });

  return res.redirect("/auteurs?succes=Auteur modifie avec succes.");
}

async function supprimerAuteur(req, res) {
  const auteur = await Auteur.findByPk(req.params.id);

  if (!auteur) {
    return res.redirect("/auteurs?erreur=Auteur introuvable.");
  }

  try {
    await auteur.destroy();
    return res.redirect("/auteurs?succes=Auteur supprime avec succes.");
  } catch (error) {
    return res.redirect(
      "/auteurs?erreur=Impossible de supprimer cet auteur."
    );
  }
}

async function listerCategories(req, res) {
  const categories = await Categorie.findAll({
    include: [{ model: Livre, as: "livres", attributes: ["id"] }],
    order: [["nom", "ASC"]],
  });

  return res.render("categories/liste", {
    titre: "Categories",
    pageActive: "categories",
    categories,
  });
}

function afficherCreationCategorie(req, res) {
  return res.render("categories/formulaire", {
    titre: "Nouvelle categorie",
    pageActive: "categories",
    mode: "creation",
    erreurs: {},
    donnees: {
      nom: "",
      description: "",
      image: "",
    },
  });
}

async function creerCategorie(req, res) {
  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("categories/formulaire", {
      titre: "Nouvelle categorie",
      pageActive: "categories",
      mode: "creation",
      erreurs,
      donnees: req.body,
    });
  }

  try {
    await Categorie.create({
      nom: req.body.nom,
      description: req.body.description || null,
      image: imageDepuisFichier(req, null),
    });

    return res.redirect("/categories?succes=Categorie creee avec succes.");
  } catch (error) {
    return res.status(400).render("categories/formulaire", {
      titre: "Nouvelle categorie",
      pageActive: "categories",
      mode: "creation",
      erreurs: {
        nom: "Impossible de creer cette categorie. Le nom existe peut-etre deja.",
      },
      donnees: req.body,
    });
  }
}

async function afficherModificationCategorie(req, res) {
  const categorie = await Categorie.findByPk(req.params.id);

  if (!categorie) {
    return res.redirect("/categories?erreur=Categorie introuvable.");
  }

  return res.render("categories/formulaire", {
    titre: "Modifier une categorie",
    pageActive: "categories",
    mode: "modification",
    erreurs: {},
    donnees: categorie.toJSON(),
  });
}

async function modifierCategorie(req, res) {
  const categorie = await Categorie.findByPk(req.params.id);

  if (!categorie) {
    return res.redirect("/categories?erreur=Categorie introuvable.");
  }

  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("categories/formulaire", {
      titre: "Modifier une categorie",
      pageActive: "categories",
      mode: "modification",
      erreurs,
      donnees: {
        id: categorie.id,
        nom: req.body.nom,
        description: req.body.description,
        image: categorie.image,
      },
    });
  }

  try {
    await categorie.update({
      nom: req.body.nom,
      description: req.body.description || null,
      image: imageDepuisFichier(req, categorie.image),
    });

    return res.redirect("/categories?succes=Categorie modifiee avec succes.");
  } catch (error) {
    return res.status(400).render("categories/formulaire", {
      titre: "Modifier une categorie",
      pageActive: "categories",
      mode: "modification",
      erreurs: {
        nom: "Impossible de modifier cette categorie.",
      },
      donnees: {
        id: categorie.id,
        nom: req.body.nom,
        description: req.body.description,
        image: categorie.image,
      },
    });
  }
}

async function supprimerCategorie(req, res) {
  const categorie = await Categorie.findByPk(req.params.id);

  if (!categorie) {
    return res.redirect("/categories?erreur=Categorie introuvable.");
  }

  try {
    await categorie.destroy();
    return res.redirect("/categories?succes=Categorie supprimee avec succes.");
  } catch (error) {
    return res.redirect(
      "/categories?erreur=Impossible de supprimer cette categorie."
    );
  }
}

async function listerLivres(req, res) {
  const where = {};

  if (req.query.titre) {
    where.titre = {
      [Op.like]: `%${req.query.titre}%`,
    };
  }

  if (req.query.categorieId) {
    where.categorieId = req.query.categorieId;
  }

  if (req.query.disponible === "true") {
    where.quantiteDisponible = {
      [Op.gt]: 0,
    };
  }

  const [livres, categories] = await Promise.all([
    Livre.findAll({
      where,
      include: [
        { model: Auteur, as: "auteur", attributes: ["nom", "prenom"] },
        { model: Categorie, as: "categorie", attributes: ["nom"] },
      ],
      order: [["titre", "ASC"]],
    }),
    Categorie.findAll({ order: [["nom", "ASC"]] }),
  ]);

  return res.render("livres/liste", {
    titre: "Livres",
    pageActive: "livres",
    livres,
    categories,
    filtres: {
      titre: req.query.titre || "",
      categorieId: req.query.categorieId || "",
      disponible: req.query.disponible === "true",
    },
  });
}

async function afficherCreationLivre(req, res) {
  const [auteurs, categories] = await Promise.all([
    Auteur.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] }),
    Categorie.findAll({ order: [["nom", "ASC"]] }),
  ]);

  return res.render("livres/formulaire", {
    titre: "Nouveau livre",
    pageActive: "livres",
    mode: "creation",
    erreurs: {},
    auteurs,
    categories,
    donnees: {
      titre: "",
      isbn: "",
      resume: "",
      anneePublication: "",
      auteurId: "",
      categorieId: "",
      quantiteTotale: 1,
      quantiteDisponible: 1,
      image: "",
    },
  });
}

async function creerLivre(req, res) {
  const [auteurs, categories] = await Promise.all([
    Auteur.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] }),
    Categorie.findAll({ order: [["nom", "ASC"]] }),
  ]);

  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Number(req.body.quantiteDisponible) > Number(req.body.quantiteTotale)) {
    erreurs.quantiteDisponible =
      "La quantite disponible ne peut pas depasser la quantite totale.";
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("livres/formulaire", {
      titre: "Nouveau livre",
      pageActive: "livres",
      mode: "creation",
      erreurs,
      auteurs,
      categories,
      donnees: req.body,
    });
  }

  try {
    await Livre.create({
      titre: req.body.titre,
      isbn: req.body.isbn,
      resume: req.body.resume || null,
      anneePublication: req.body.anneePublication || null,
      auteurId: req.body.auteurId,
      categorieId: req.body.categorieId,
      quantiteTotale: Number(req.body.quantiteTotale),
      quantiteDisponible: Number(req.body.quantiteDisponible),
      image: imageDepuisFichier(req, null),
    });

    return res.redirect("/livres?succes=Livre cree avec succes.");
  } catch (error) {
    return res.status(400).render("livres/formulaire", {
      titre: "Nouveau livre",
      pageActive: "livres",
      mode: "creation",
      erreurs: {
        isbn: "Impossible de creer ce livre. L'ISBN existe peut-etre deja.",
      },
      auteurs,
      categories,
      donnees: req.body,
    });
  }
}

async function afficherModificationLivre(req, res) {
  const [livre, auteurs, categories] = await Promise.all([
    Livre.findByPk(req.params.id),
    Auteur.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] }),
    Categorie.findAll({ order: [["nom", "ASC"]] }),
  ]);

  if (!livre) {
    return res.redirect("/livres?erreur=Livre introuvable.");
  }

  return res.render("livres/formulaire", {
    titre: "Modifier un livre",
    pageActive: "livres",
    mode: "modification",
    erreurs: {},
    auteurs,
    categories,
    donnees: livre.toJSON(),
  });
}

async function modifierLivre(req, res) {
  const [livre, auteurs, categories] = await Promise.all([
    Livre.findByPk(req.params.id),
    Auteur.findAll({ order: [["nom", "ASC"], ["prenom", "ASC"]] }),
    Categorie.findAll({ order: [["nom", "ASC"]] }),
  ]);

  if (!livre) {
    return res.redirect("/livres?erreur=Livre introuvable.");
  }

  const erreurs = extraireErreurs(req);
  const erreurImage = donnerErreurMulter(req.erreurTeleversement);

  if (erreurImage) {
    erreurs.image = erreurImage;
  }

  if (Number(req.body.quantiteDisponible) > Number(req.body.quantiteTotale)) {
    erreurs.quantiteDisponible =
      "La quantite disponible ne peut pas depasser la quantite totale.";
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("livres/formulaire", {
      titre: "Modifier un livre",
      pageActive: "livres",
      mode: "modification",
      erreurs,
      auteurs,
      categories,
      donnees: {
        id: livre.id,
        ...req.body,
        image: livre.image,
      },
    });
  }

  try {
    await livre.update({
      titre: req.body.titre,
      isbn: req.body.isbn,
      resume: req.body.resume || null,
      anneePublication: req.body.anneePublication || null,
      auteurId: req.body.auteurId,
      categorieId: req.body.categorieId,
      quantiteTotale: Number(req.body.quantiteTotale),
      quantiteDisponible: Number(req.body.quantiteDisponible),
      image: imageDepuisFichier(req, livre.image),
    });

    return res.redirect("/livres?succes=Livre modifie avec succes.");
  } catch (error) {
    return res.status(400).render("livres/formulaire", {
      titre: "Modifier un livre",
      pageActive: "livres",
      mode: "modification",
      erreurs: {
        isbn: "Impossible de modifier ce livre.",
      },
      auteurs,
      categories,
      donnees: {
        id: livre.id,
        ...req.body,
        image: livre.image,
      },
    });
  }
}

async function supprimerLivre(req, res) {
  const livre = await Livre.findByPk(req.params.id);

  if (!livre) {
    return res.redirect("/livres?erreur=Livre introuvable.");
  }

  try {
    await livre.destroy();
    return res.redirect("/livres?succes=Livre supprime avec succes.");
  } catch (error) {
    return res.redirect("/livres?erreur=Impossible de supprimer ce livre.");
  }
}

async function listerEmprunts(req, res) {
  const estAdministrateur = req.utilisateurInterface.role.nom === "administrateur";
  const where = {};

  if (!estAdministrateur) {
    where.utilisateurId = req.utilisateurInterface.id;
  }

  if (req.query.statut) {
    where.statut = req.query.statut;
  }

  const emprunts = await Emprunt.findAll({
    where,
    include: [
      {
        model: Utilisateur,
        as: "utilisateur",
        attributes: ["nomComplet", "email"],
      },
      {
        model: Livre,
        as: "livre",
        attributes: ["id", "titre", "isbn"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.render("emprunts/liste", {
    titre: "Emprunts",
    pageActive: "emprunts",
    emprunts,
    estAdministrateur,
    filtreStatut: req.query.statut || "",
  });
}

async function afficherCreationEmprunt(req, res) {
  const estAdministrateur = req.utilisateurInterface.role.nom === "administrateur";

  const [livres, utilisateurs] = await Promise.all([
    Livre.findAll({
      where: { quantiteDisponible: { [Op.gt]: 0 } },
      order: [["titre", "ASC"]],
    }),
    estAdministrateur
      ? Utilisateur.findAll({
          include: [{ model: Role, as: "role", attributes: ["nom"] }],
          order: [["nomComplet", "ASC"]],
        })
      : Promise.resolve([]),
  ]);

  return res.render("emprunts/formulaire", {
    titre: "Nouvel emprunt",
    pageActive: "emprunts",
    mode: "creation",
    erreurs: {},
    livres,
    utilisateurs,
    estAdministrateur,
    donnees: {
      livreId: "",
      utilisateurId: estAdministrateur ? "" : req.utilisateurInterface.id,
      dateRetourPrevue: "",
      statut: "en_cours",
    },
  });
}

async function creerEmprunt(req, res) {
  const estAdministrateur = req.utilisateurInterface.role.nom === "administrateur";
  const [livres, utilisateurs] = await Promise.all([
    Livre.findAll({
      where: { quantiteDisponible: { [Op.gt]: 0 } },
      order: [["titre", "ASC"]],
    }),
    estAdministrateur
      ? Utilisateur.findAll({
          include: [{ model: Role, as: "role", attributes: ["nom"] }],
          order: [["nomComplet", "ASC"]],
        })
      : Promise.resolve([]),
  ]);

  const erreurs = extraireErreurs(req);

  if (estAdministrateur && !req.body.utilisateurId) {
    erreurs.utilisateurId = "Choisissez un utilisateur.";
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("emprunts/formulaire", {
      titre: "Nouvel emprunt",
      pageActive: "emprunts",
      mode: "creation",
      erreurs,
      livres,
      utilisateurs,
      estAdministrateur,
      donnees: {
        ...req.body,
        utilisateurId: req.body.utilisateurId || req.utilisateurInterface.id,
      },
    });
  }

  const utilisateurId = estAdministrateur
    ? Number(req.body.utilisateurId)
    : req.utilisateurInterface.id;

  const [utilisateur, livre] = await Promise.all([
    Utilisateur.findByPk(utilisateurId),
    Livre.findByPk(req.body.livreId),
  ]);

  if (!utilisateur) {
    erreurs.utilisateurId = "Utilisateur introuvable.";
  }

  if (!livre) {
    erreurs.livreId = "Livre introuvable.";
  } else if (livre.quantiteDisponible <= 0) {
    erreurs.livreId = "Ce livre n'est plus disponible.";
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(422).render("emprunts/formulaire", {
      titre: "Nouvel emprunt",
      pageActive: "emprunts",
      mode: "creation",
      erreurs,
      livres,
      utilisateurs,
      estAdministrateur,
      donnees: {
        ...req.body,
        utilisateurId,
      },
    });
  }

  await Emprunt.create({
    utilisateurId,
    livreId: livre.id,
    dateEmprunt: aujourdhui(),
    dateRetourPrevue: req.body.dateRetourPrevue,
    statut: "en_cours",
  });

  await livre.update({
    quantiteDisponible: livre.quantiteDisponible - 1,
  });

  return res.redirect("/emprunts?succes=Emprunt cree avec succes.");
}

async function afficherModificationEmprunt(req, res) {
  const emprunt = await Emprunt.findByPk(req.params.id, {
    include: [
      { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet"] },
      { model: Livre, as: "livre", attributes: ["titre"] },
    ],
  });

  if (!emprunt) {
    return res.redirect("/emprunts?erreur=Emprunt introuvable.");
  }

  return res.render("emprunts/formulaire", {
    titre: "Modifier un emprunt",
    pageActive: "emprunts",
    mode: "modification",
    erreurs: {},
    livres: [],
    utilisateurs: [],
    estAdministrateur: true,
    donnees: {
      id: emprunt.id,
      utilisateurNom: emprunt.utilisateur.nomComplet,
      livreTitre: emprunt.livre.titre,
      dateRetourPrevue: emprunt.dateRetourPrevue,
      statut: emprunt.statut,
      dateRetourEffective: emprunt.dateRetourEffective || "",
    },
  });
}

async function modifierEmprunt(req, res) {
  const emprunt = await Emprunt.findByPk(req.params.id, {
    include: [{ model: Livre, as: "livre" }],
  });

  if (!emprunt) {
    return res.redirect("/emprunts?erreur=Emprunt introuvable.");
  }

  const erreurs = extraireErreurs(req);

  if (Object.keys(erreurs).length > 0) {
    const empruntComplet = await Emprunt.findByPk(req.params.id, {
      include: [
        { model: Utilisateur, as: "utilisateur", attributes: ["nomComplet"] },
        { model: Livre, as: "livre", attributes: ["titre"] },
      ],
    });

    return res.status(422).render("emprunts/formulaire", {
      titre: "Modifier un emprunt",
      pageActive: "emprunts",
      mode: "modification",
      erreurs,
      livres: [],
      utilisateurs: [],
      estAdministrateur: true,
      donnees: {
        id: emprunt.id,
        utilisateurNom: empruntComplet.utilisateur.nomComplet,
        livreTitre: empruntComplet.livre.titre,
        dateRetourPrevue: req.body.dateRetourPrevue,
        statut: req.body.statut,
        dateRetourEffective:
          req.body.statut === "retourne"
            ? req.body.dateRetourEffective || aujourdhui()
            : "",
      },
    });
  }

  if (emprunt.statut === "en_cours" && req.body.statut === "retourne") {
    await emprunt.livre.update({
      quantiteDisponible: emprunt.livre.quantiteDisponible + 1,
    });
  }

  if (emprunt.statut === "retourne" && req.body.statut === "en_cours") {
    if (emprunt.livre.quantiteDisponible <= 0) {
      return res.redirect(
        "/emprunts?erreur=Impossible de remettre cet emprunt en cours. Aucun exemplaire n'est disponible."
      );
    }

    await emprunt.livre.update({
      quantiteDisponible: emprunt.livre.quantiteDisponible - 1,
    });
  }

  await emprunt.update({
    dateRetourPrevue: req.body.dateRetourPrevue,
    statut: req.body.statut,
    dateRetourEffective:
      req.body.statut === "retourne" ? req.body.dateRetourEffective || aujourdhui() : null,
  });

  return res.redirect("/emprunts?succes=Emprunt modifie avec succes.");
}

async function retournerEmprunt(req, res) {
  const emprunt = await Emprunt.findByPk(req.params.id, {
    include: [{ model: Livre, as: "livre" }],
  });

  if (!emprunt) {
    return res.redirect("/emprunts?erreur=Emprunt introuvable.");
  }

  const estAdministrateur = req.utilisateurInterface.role.nom === "administrateur";
  const estProprietaire = emprunt.utilisateurId === req.utilisateurInterface.id;

  if (!estAdministrateur && !estProprietaire) {
    return res.redirect("/emprunts?erreur=Vous ne pouvez pas retourner cet emprunt.");
  }

  if (emprunt.statut === "retourne") {
    return res.redirect("/emprunts?erreur=Cet emprunt est deja retourne.");
  }

  await emprunt.update({
    statut: "retourne",
    dateRetourEffective: aujourdhui(),
  });

  await emprunt.livre.update({
    quantiteDisponible: emprunt.livre.quantiteDisponible + 1,
  });

  return res.redirect("/emprunts?succes=Le retour du livre a ete enregistre.");
}

async function supprimerEmprunt(req, res) {
  const emprunt = await Emprunt.findByPk(req.params.id, {
    include: [{ model: Livre, as: "livre" }],
  });

  if (!emprunt) {
    return res.redirect("/emprunts?erreur=Emprunt introuvable.");
  }

  if (emprunt.statut === "en_cours") {
    await emprunt.livre.update({
      quantiteDisponible: emprunt.livre.quantiteDisponible + 1,
    });
  }

  await emprunt.destroy();

  return res.redirect("/emprunts?succes=Emprunt supprime avec succes.");
}

module.exports = {
  listerRoles,
  afficherCreationRole,
  creerRole,
  afficherModificationRole,
  modifierRole,
  supprimerRole,
  listerUtilisateurs,
  afficherCreationUtilisateur,
  creerUtilisateur,
  afficherModificationUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
  listerAuteurs,
  afficherCreationAuteur,
  creerAuteur,
  afficherModificationAuteur,
  modifierAuteur,
  supprimerAuteur,
  listerCategories,
  afficherCreationCategorie,
  creerCategorie,
  afficherModificationCategorie,
  modifierCategorie,
  supprimerCategorie,
  listerLivres,
  afficherCreationLivre,
  creerLivre,
  afficherModificationLivre,
  modifierLivre,
  supprimerLivre,
  listerEmprunts,
  afficherCreationEmprunt,
  creerEmprunt,
  afficherModificationEmprunt,
  modifierEmprunt,
  retournerEmprunt,
  supprimerEmprunt,
};
