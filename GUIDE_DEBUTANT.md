# Notes

Ordre simple si tu veux lire vite :

1. `serveur.js`
2. `routes/routesAuthentification.js`
3. `controleurs/authentificationControleur.js`
4. `modeles/index.js`
5. `routes/routesEmprunts.js`
6. `controleurs/empruntControleur.js`

Idée du projet :

- un membre s'inscrit
- il se connecte
- il peut emprunter un livre
- il peut retourner un livre
- l'administrateur gere le reste

Relations principales :

- un role -> plusieurs utilisateurs
- un auteur -> plusieurs livres
- une categorie -> plusieurs livres
- un utilisateur -> plusieurs emprunts
- un livre -> plusieurs emprunts

Le projet est simple exprès.
