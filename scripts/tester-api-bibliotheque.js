const mysql = require("mysql2/promise");
const { spawn } = require("child_process");
const path = require("path");

const racine = __dirname ? path.join(__dirname, "..") : process.cwd();
const configuration = require(path.join(racine, "configuration", "environnement"));

function attendre(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifierConnexionBDD() {
  const connexion = await mysql.createConnection({
    host: configuration.baseDeDonnees.host,
    port: configuration.baseDeDonnees.port,
    user: configuration.baseDeDonnees.utilisateur,
    password: configuration.baseDeDonnees.motDePasse,
  });

  await connexion.query(
    `CREATE DATABASE IF NOT EXISTS \`${configuration.baseDeDonnees.nom}\``
  );
  await connexion.end();
}

async function requeteJson(url, options = {}) {
  const reponse = await fetch(url, options);
  const texte = await reponse.text();

  let json = null;
  try {
    json = texte ? JSON.parse(texte) : null;
  } catch (error) {
    json = { texte };
  }

  if (!reponse.ok) {
    const erreur = new Error(`HTTP ${reponse.status} sur ${url}`);
    erreur.payload = json;
    throw erreur;
  }

  return json;
}

async function lancerServeur() {
  const serveur = spawn(process.execPath, ["serveur.js"], {
    cwd: racine,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let sortie = "";
  let erreur = "";

  serveur.stdout.on("data", (buffer) => {
    sortie += buffer.toString();
  });

  serveur.stderr.on("data", (buffer) => {
    erreur += buffer.toString();
  });

  for (let tentative = 0; tentative < 20; tentative += 1) {
    await attendre(500);

    try {
      await requeteJson("http://127.0.0.1:3000/");
      return { serveur, sortie, erreur };
    } catch (e) {
      if (serveur.exitCode !== null) {
        throw new Error(`Le serveur a quitte trop tot.\n${sortie}\n${erreur}`);
      }
    }
  }

  serveur.kill();
  throw new Error(`Impossible de joindre le serveur.\n${sortie}\n${erreur}`);
}

async function executerTests() {
  await verifierConnexionBDD();
  const { serveur } = await lancerServeur();

  try {
    const adresseBase = "http://127.0.0.1:3000";
    const courrielAdministrateur =
      configuration.authentification.courrielAdministrateur ||
      "administrateur.local@exemple.com";
    const motDePasseAdministrateur =
      configuration.authentification.motDePasseAdministrateur ||
      "Bibliotheque123!";

    const membre = {
      nomComplet: "Membre Test",
      email: `membre.${Date.now()}@exemple.local`,
      motDePasse: "motdepasse123",
    };

    const inscription = await requeteJson(`${adresseBase}/api/authentification/inscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(membre),
    });

    const connexionMembre = await requeteJson(`${adresseBase}/api/authentification/connexion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: membre.email,
        motDePasse: membre.motDePasse,
      }),
    });

    let connexionAdministrateur = null;
    let jetonAdministrateur = "";

    if (
      configuration.authentification.courrielAdministrateur &&
      configuration.authentification.motDePasseAdministrateur
    ) {
      connexionAdministrateur = await requeteJson(`${adresseBase}/api/authentification/connexion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: courrielAdministrateur,
          motDePasse: motDePasseAdministrateur,
        }),
      });

      jetonAdministrateur = connexionAdministrateur.jeton;
    }

    const profil = await requeteJson(`${adresseBase}/api/authentification/profil`, {
      headers: {
        Authorization: `Bearer ${connexionMembre.jeton}`,
      },
    });

    let categorie = null;
    let auteur = null;
    let livre = null;
    let emprunt = null;

    if (jetonAdministrateur) {
      categorie = await requeteJson(`${adresseBase}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jetonAdministrateur}`,
        },
        body: JSON.stringify({
          nom: `Roman ${Date.now()}`,
          description: "Categorie de test",
        }),
      });

      auteur = await requeteJson(`${adresseBase}/api/auteurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jetonAdministrateur}`,
        },
        body: JSON.stringify({
          nom: "Hugo",
          prenom: `Victor ${Date.now()}`,
          biographie: "Auteur de test",
        }),
      });

      livre = await requeteJson(`${adresseBase}/api/livres`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jetonAdministrateur}`,
        },
        body: JSON.stringify({
          titre: `Livre ${Date.now()}`,
          resume: "Livre de test",
          anneePublication: 2024,
          isbn: `${Date.now()}12345`,
          quantiteTotale: 2,
          quantiteDisponible: 2,
          auteurId: auteur.auteur.id,
          categorieId: categorie.categorie.id,
        }),
      });

      await requeteJson(`${adresseBase}/api/livres?page=1&limit=5&disponible=true`);

      emprunt = await requeteJson(`${adresseBase}/api/emprunts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${connexionMembre.jeton}`,
        },
        body: JSON.stringify({
          livreId: livre.livre.id,
        }),
      });

      await requeteJson(`${adresseBase}/api/emprunts/mes-emprunts`, {
        headers: {
          Authorization: `Bearer ${connexionMembre.jeton}`,
        },
      });

      await requeteJson(`${adresseBase}/api/emprunts/${emprunt.emprunt.id}/retour`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${connexionMembre.jeton}`,
        },
      });

      await requeteJson(`${adresseBase}/api/emprunts?statut=retourne&page=1&limit=5`, {
        headers: {
          Authorization: `Bearer ${jetonAdministrateur}`,
        },
      });
    }

    console.log(
      JSON.stringify(
        {
          succes: true,
          inscription: inscription.message,
          profil: profil.email,
          administrateurTeste: Boolean(jetonAdministrateur),
          livreCree: Boolean(livre),
          empruntTeste: Boolean(emprunt),
        },
        null,
        2
      )
    );
  } finally {
    serveur.kill();
  }
}

executerTests().catch((error) => {
  console.error(error.message);
  if (error.payload) {
    console.error(JSON.stringify(error.payload, null, 2));
  }
  process.exit(1);
});
