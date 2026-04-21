# Projet bibliotheque

Petit projet API pour gerer une bibliotheque.

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
- CRUD auteurs
- CRUD categories
- CRUD livres
- emprunt
- retour

Technos :

- `Node.js`
- `Express`
- `Sequelize`
- `MySQL`
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

Fichier Postman :

- `collection-postman-bibliotheque.json`

Schémas :

- `documentation/modele-donnees.md`
- `documentation/modele-physique.sql`

Il faut remplir aussi `soumission/infos-soumission.txt`.
