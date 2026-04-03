# Projet : API de gestion de bibliotheque

## Sujet choisi

Le sujet choisi est une application simple de gestion de bibliotheque.

## Modele entite-associations

```mermaid
erDiagram
    ROLE ||--o{ UTILISATEUR : possede
    UTILISATEUR ||--o{ EMPRUNT : effectue
    AUTEUR ||--o{ LIVRE : ecrit
    CATEGORIE ||--o{ LIVRE : classe
    LIVRE ||--o{ EMPRUNT : concerne

    ROLE {
      int id PK
      string nom
      string description
    }

    UTILISATEUR {
      int id PK
      string nomComplet
      string email
      string motDePasse
      boolean actif
      int roleId FK
    }

    AUTEUR {
      int id PK
      string nom
      string prenom
      text biographie
    }

    CATEGORIE {
      int id PK
      string nom
      string description
    }

    LIVRE {
      int id PK
      string titre
      text resume
      int anneePublication
      string isbn
      int quantiteTotale
      int quantiteDisponible
      int auteurId FK
      int categorieId FK
    }

    EMPRUNT {
      int id PK
      date dateEmprunt
      date dateRetourPrevue
      date dateRetourEffective
      string statut
      int utilisateurId FK
      int livreId FK
    }
```

## Resume du modele physique

- `roles` contient les types d'utilisateurs.
- `utilisateurs` contient les comptes et la relation avec les roles.
- `auteurs` contient les auteurs des livres.
- `categories` permet de classer les livres.
- `livres` stocke les informations des livres et les quantites disponibles.
- `emprunts` suit les emprunts en cours et les retours.
