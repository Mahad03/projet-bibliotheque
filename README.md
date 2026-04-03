# Projet API de bibliotheque

Ce projet est une API REST simple de gestion de bibliotheque realisee avec Node.js, Express, Sequelize et MySQL.

Le code est volontairement ecrit de facon simple pour rester facile a comprendre pour un niveau debutant.

## Sujet choisi

Le sujet du projet est une bibliotheque. Le projet contient 6 tables :

- `roles`
- `utilisateurs`
- `auteurs`
- `categories`
- `livres`
- `emprunts`

## Fonctionnalites

- inscription et connexion avec JWT
- gestion des roles `admin` et `membre`
- CRUD des auteurs
- CRUD des categories
- CRUD des livres
- creation et retour des emprunts
- validations avec `express-validator`
- pagination pour les routes GET
- filtres simples avec les query params

## Installation

1. Installer les dependances :

```bash
npm install
```

2. Copier le fichier d'environnement :

```bash
copy .env.example .env
```

3. Creer une base de donnees MySQL nommee `bibliotheque_db`.

4. Modifier les valeurs dans `.env`.
   `JWT_SECRET` doit etre defini avec une valeur longue et unique.
   Si vous voulez un compte admin cree automatiquement, renseignez aussi `ADMIN_EMAIL` et `ADMIN_MOT_DE_PASSE`.

5. Lancer le projet :

```bash
npm run dev
```

Ou :

```bash
npm start
```

## Compte admin optionnel

Au premier demarrage, un compte administrateur est cree automatiquement si :

- `ADMIN_EMAIL` est renseigne
- `ADMIN_MOT_DE_PASSE` est renseigne

Si ces variables sont vides, l'application demarre quand meme, mais aucun admin n'est cree.

## Routes principales

### Authentification

- `POST /api/authentification/inscription`
- `POST /api/authentification/connexion`
- `GET /api/authentification/profil`

### Roles

- `GET /api/roles`
- `GET /api/roles/:id`
- `POST /api/roles`
- `PUT /api/roles/:id`
- `DELETE /api/roles/:id`

### Utilisateurs

- `GET /api/utilisateurs`
- `GET /api/utilisateurs/:id`
- `PUT /api/utilisateurs/:id`
- `DELETE /api/utilisateurs/:id`

### Auteurs

- `GET /api/auteurs`
- `GET /api/auteurs/:id`
- `POST /api/auteurs`
- `PUT /api/auteurs/:id`
- `DELETE /api/auteurs/:id`

### Categories

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Livres

- `GET /api/livres`
- `GET /api/livres/:id`
- `POST /api/livres`
- `PUT /api/livres/:id`
- `DELETE /api/livres/:id`

### Emprunts

- `GET /api/emprunts` : admin seulement
- `GET /api/emprunts/mes-emprunts`
- `POST /api/emprunts`
- `PUT /api/emprunts/:id/retour`

## Exemples de query params

### Pagination

- `GET /api/livres?page=1&limit=5`
- `GET /api/auteurs?page=2&limit=10`

### Filtres

- `GET /api/livres?titre=harry`
- `GET /api/livres?categorieId=1`
- `GET /api/livres?auteurId=2`
- `GET /api/livres?disponible=true`
- `GET /api/categories?nom=roman`
- `GET /api/emprunts?statut=en_cours`

## Structure du projet

- `configuration/`
- `controleurs/`
- `documentation/`
- `intergiciels/`
- `modeles/`
- `routes/`
- `utilitaires/`
- `validations/`

## Postman

Une collection Postman de base est disponible dans le fichier `collection_postman.json`.

## Scripts utiles

- `npm run verifier:api`
  - lance un scenario de verification automatique sur l'API avec la base MySQL configuree dans `.env`
  - ce script suppose que les identifiants MySQL sont corrects et qu'un compte admin peut etre cree si `ADMIN_EMAIL` et `ADMIN_MOT_DE_PASSE` sont renseignes
- `npm run mettre-a-jour:soumission`
  - regenere `soumission/infos-soumission.txt`
  - reconstruit le dossier `soumission/Projet1_IFM30-3/`
  - recree l'archive `soumission/Projet1_IFM30-3.zip`
