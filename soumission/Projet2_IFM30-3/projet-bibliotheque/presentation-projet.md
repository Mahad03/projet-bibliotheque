# Projet bibliotheque

Projet complet de bibliotheque avec backend API et interface EJS.

Tables :

- `roles`
- `utilisateurs`
- `auteurs`
- `categories`
- `livres`
- `emprunts`

Ce qu'il y a :

- inscription
- connexion
- profil
- interface EJS avec page d'accueil
- partials partages (entete, alertes, pied de page)
- CRUD roles
- CRUD utilisateurs
- CRUD auteurs
- CRUD categories
- CRUD livres
- CRUD emprunts
- images pour auteurs, categories et livres

Technos :

- `Node.js`
- `Express`
- `Sequelize`
- `MySQL`
- `EJS`
- `Postman`

Pour lancer :

```bash
npm install
copy .env.example .env
npm run developpement
```

Si `nodemon` ne marche pas :

```bash
npm run demarrer
```

Pages principales :

- `/`
- `/connexion`
- `/inscription`
- `/tableau-de-bord`
- `/roles`
- `/utilisateurs`
- `/auteurs`
- `/categories`
- `/livres`
- `/emprunts`

Fichier Postman :

- `collection-postman-bibliotheque.json`

Schemas :

- `documentation/modele-donnees.md`
- `documentation/modele-physique.sql`

Soumission :

- `soumission/Projet2_IFM30-3.zip`
- `soumission/infos-soumission.txt`
