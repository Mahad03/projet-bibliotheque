powershell -NoProfile -ExecutionPolicy Bypass -File "$PSScriptRoot\mettre-a-jour-soumission.ps1" `
    -NomProjet "Projet2_IFM30-3" `
    -NomArchive "Projet2_IFM30-3.zip" `
    -TitreSoumission "Projet de conception web - Partie 2 - IFM30 - 3" `
    -LienGithub "https://github.com/Mahad03/projet-bibliotheque" `
    -Membres @("Mahad Mouhoumed", "Sofiane Bouyoucef") `
    -RepartitionTables @(
        "Mahad Mouhoumed : roles, utilisateurs, emprunts",
        "Sofiane Bouyoucef : auteurs, categories, livres"
    )
