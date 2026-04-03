# Guide debutant

Ce fichier explique le projet avec des mots simples.

## Idee generale

Le projet represente une bibliotheque.

Un utilisateur peut :
- s'inscrire
- se connecter
- voir son profil
- emprunter un livre
- retourner un livre

Un administrateur peut aussi :
- gerer les roles
- gerer les utilisateurs
- gerer les auteurs
- gerer les categories
- gerer les livres
- voir tous les emprunts

## Ordre conseille pour lire le code

1. `serveur.js`
2. `routes/routesAuthentification.js`
3. `controleurs/authentificationControleur.js`
4. `intergiciels/authentification.js`
5. `modeles/index.js`
6. `routes/routesEmprunts.js`
7. `controleurs/empruntControleur.js`

## Comment fonctionne la connexion

1. l'utilisateur envoie son email et son mot de passe
2. le controleur cherche l'utilisateur dans la base
3. le mot de passe est compare avec `bcrypt`
4. si tout est correct, un token JWT est cree
5. ce token est envoye dans les routes protegees

## Comment fonctionne un emprunt

1. le membre choisit un livre
2. l'API verifie que le livre existe
3. l'API verifie qu'il reste des exemplaires disponibles
4. l'API cree une ligne dans la table `emprunts`
5. l'API diminue `quantiteDisponible`

## Comment fonctionne un retour

1. l'API retrouve l'emprunt
2. elle verifie qu'il n'est pas deja retourne
3. elle met le statut a `retourne`
4. elle augmente `quantiteDisponible` du livre

## Relations entre les tables

- un role a plusieurs utilisateurs
- un auteur a plusieurs livres
- une categorie a plusieurs livres
- un utilisateur a plusieurs emprunts
- un livre a plusieurs emprunts

## Pourquoi il y a plusieurs dossiers

Le projet est separe pour rester clair :

- `routes` : les URL
- `controleurs` : les actions
- `modeles` : les tables
- `intergiciels` : les verifications avant d'entrer dans les actions

## Limite importante

Le projet est fait pour un travail scolaire.
Il est volontairement simple et lisible.
Il n'essaie pas d'etre une architecture avancee de production.
