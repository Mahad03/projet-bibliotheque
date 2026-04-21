$racine = Split-Path -Parent $PSScriptRoot
$dossierLivraison = Join-Path $racine "livraison"
$dossierRepo = Join-Path $dossierLivraison "projet-bibliotheque-partie2"

if (Test-Path $dossierRepo) {
    Remove-Item -LiteralPath $dossierRepo -Recurse -Force
}

New-Item -ItemType Directory -Path $dossierRepo -Force | Out-Null

$elementsProjet = @(
    "configuration",
    "controleurs",
    "controleursPages",
    "documentation",
    "intergiciels",
    "modeles",
    "public",
    "routes",
    "utilitaires",
    "validations",
    "views",
    ".env.example",
    ".gitignore",
    "README.md",
    "presentation-projet.md",
    "package.json",
    "package-lock.json",
    "serveur.js",
    "collection-postman-bibliotheque.json"
)

foreach ($element in $elementsProjet) {
    $source = Join-Path $racine $element
    $destination = Join-Path $dossierRepo $element

    if (Test-Path $source) {
        Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
    }
}

@"
Projet prepare pour un depot GitHub separe pour la partie 2.

Etapes conseillees :
1. Creer un nouveau depot GitHub vide pour le frontend / partie 2.
2. Copier ce dossier dedans ou faire un `git init`.
3. Faire les commits et branches reelles des membres.
4. Ajouter Sofiane et le professeur comme collaborateurs.
"@ | Set-Content -LiteralPath (Join-Path $dossierRepo "A_LIRE_AVANT_PUSH.txt") -Encoding UTF8

Write-Output "Dossier prepare : $dossierRepo"
