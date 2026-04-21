# Projet de conception web - Partie 2

Projet de bibliotheque avec :

- API Node.js / Express / Sequelize / MySQL
- interface EJS
- authentification et autorisations
- CRUD pour les tables du projet
- validations de formulaires
- images pour auteurs, categories et livres

## Tables du projet

- `roles`
- `utilisateurs`
- `auteurs`
- `categories`
- `livres`
- `emprunts`

## Lancement local

1. Installer les dependances :

```bash
npm install
```

2. Verifier le fichier `.env`

3. Demarrer le projet :

```bash
npm run developpement
```

Si `nodemon` ne fonctionne pas :

```bash
npm run demarrer
```

## Pages principales

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

## Verification rapide

Pour verifier l'API :

```bash
npm run verifier-api
```

## Fichiers utiles

- Documentation du projet : `presentation-projet.md`
- Collection Postman : `collection-postman-bibliotheque.json`
- Schema conceptuel : `documentation/modele-donnees.md`
- Schema physique : `documentation/modele-physique.sql`
- Soumission partie 2 : `soumission/Projet2_IFM30-3.zip`
