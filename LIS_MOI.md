# Projet bibliotheque - lecture rapide

Ce projet est une API Node.js pour gerer une petite bibliotheque.

## Fichiers a comprendre en premier

1. `serveur.js`
- demarre Express
- charge toutes les routes
- connecte Sequelize a MySQL
- cree les roles et l'admin si necessaire

2. `configuration/environnement.js`
- lit les variables du fichier `.env`
- prepare la configuration de la base de donnees
- prepare la configuration JWT

3. `modeles/index.js`
- charge les 6 tables
- declare les relations entre elles

4. `routes/`
- chaque fichier contient les routes d'une ressource
- les routes appellent ensuite les controleurs

5. `controleurs/`
- contient la logique des actions:
  inscription, connexion, creation livre, emprunt, retour, etc.

## Comment une requete fonctionne

Exemple avec `POST /api/emprunts`

1. la route se trouve dans `routes/routesEmprunts.js`
2. le middleware `authentification.js` verifie le token
3. la validation verifie que `livreId` est correct
4. `empruntControleur.js` cree l'emprunt
5. la quantite disponible du livre diminue de 1

## Les 6 tables du projet

- `roles`
- `utilisateurs`
- `auteurs`
- `categories`
- `livres`
- `emprunts`

## Ce que fait chaque dossier

- `configuration` : connexion et variables d'environnement
- `modeles` : tables Sequelize
- `routes` : URL de l'API
- `controleurs` : logique des operations
- `intergiciels` : authentification, autorisation, validation
- `validations` : regles `express-validator`
- `documentation` : schema logique et schema physique
- `scripts` : test API et generation de la soumission

## Documentation complete

Consulte `README.md` pour la documentation complete.
