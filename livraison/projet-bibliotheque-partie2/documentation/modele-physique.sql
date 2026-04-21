CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomComplet VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    roleId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(id)
);

CREATE TABLE auteurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    biographie TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE livres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    resume TEXT,
    anneePublication INT,
    isbn VARCHAR(255) NOT NULL UNIQUE,
    quantiteTotale INT NOT NULL DEFAULT 1,
    quantiteDisponible INT NOT NULL DEFAULT 1,
    auteurId INT NOT NULL,
    categorieId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (auteurId) REFERENCES auteurs(id),
    FOREIGN KEY (categorieId) REFERENCES categories(id)
);

CREATE TABLE emprunts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dateEmprunt DATE NOT NULL,
    dateRetourPrevue DATE NOT NULL,
    dateRetourEffective DATE,
    statut ENUM('en_cours', 'retourne') NOT NULL DEFAULT 'en_cours',
    utilisateurId INT NOT NULL,
    livreId INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (utilisateurId) REFERENCES utilisateurs(id),
    FOREIGN KEY (livreId) REFERENCES livres(id)
);
