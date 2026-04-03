param(
    [string]$NomProjet = "Projet1_IFM30-3",
    [string]$NomArchive = "Projet1_IFM30-3.zip",
    [string]$LienGithub = "",
    [string[]]$Membres = @(),
    [string[]]$RepartitionTables = @()
)

$racine = Split-Path -Parent $PSScriptRoot
$dossierSoumission = Join-Path $racine "soumission"
$dossierTemporaire = Join-Path $dossierSoumission $NomProjet
$dossierProjet = Join-Path $dossierTemporaire "projet-bibliotheque"
$archive = Join-Path $dossierSoumission $NomArchive

if (Test-Path $dossierTemporaire) {
    cmd /c "rmdir /s /q `"$dossierTemporaire`""
}

if (Test-Path $archive) {
    Remove-Item -LiteralPath $archive -Force
}

New-Item -ItemType Directory -Path $dossierProjet -Force | Out-Null

$elementsProjet = @(
    "configuration",
    "controleurs",
    "documentation",
    "intergiciels",
    "modeles",
    "routes",
    "utilitaires",
    "validations",
    ".env.example",
    ".gitignore",
    "README.md",
    "LIS_MOI.md",
    "package.json",
    "package-lock.json",
    "serveur.js",
    "collection_postman.json"
)

foreach ($element in $elementsProjet) {
    $source = Join-Path $racine $element
    $destination = Join-Path $dossierProjet $element

    if (Test-Path $source) {
        Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
    }
}

Copy-Item -LiteralPath (Join-Path $racine "collection_postman.json") -Destination (Join-Path $dossierTemporaire "Bibliotheque_API.postman_collection.json") -Force
Copy-Item -LiteralPath (Join-Path $dossierSoumission "modele-entite-association.pdf") -Destination (Join-Path $dossierTemporaire "modele-entite-association.pdf") -Force
Copy-Item -LiteralPath (Join-Path $dossierSoumission "modele-physique.pdf") -Destination (Join-Path $dossierTemporaire "modele-physique.pdf") -Force

$contenuInfos = @()
$contenuInfos += "Projet 1 - IFM30 - 3"
$contenuInfos += ""
$contenuInfos += "1) Contenu du fichier zip"
$contenuInfos += "- projet sans le dossier node_modules"
$contenuInfos += "- schema du modele entite-association en PDF"
$contenuInfos += "- schema du modele physique en PDF"
$contenuInfos += "- fichier Postman"
$contenuInfos += ""
$contenuInfos += "2) Noms des membres du groupe"

if ($Membres.Count -gt 0) {
    foreach ($membre in $Membres) {
        $contenuInfos += "- $membre"
    }
} else {
    $contenuInfos += "- A completer"
}

$contenuInfos += ""
$contenuInfos += "3) Tables developpees par chacun des membres"

if ($RepartitionTables.Count -gt 0) {
    foreach ($ligne in $RepartitionTables) {
        $contenuInfos += "- $ligne"
    }
} else {
    $contenuInfos += "- A completer"
}

$contenuInfos += ""
$contenuInfos += "4) Lien GitHub"
$contenuInfos += if ([string]::IsNullOrWhiteSpace($LienGithub)) { "- A completer" } else { "- $LienGithub" }

$cheminInfos = Join-Path $dossierSoumission "infos-soumission.txt"
$contenuInfos | Set-Content -LiteralPath $cheminInfos -Encoding UTF8
Copy-Item -LiteralPath $cheminInfos -Destination (Join-Path $dossierTemporaire "infos-soumission.txt") -Force

Compress-Archive -Path (Join-Path $dossierTemporaire "*") -DestinationPath $archive -CompressionLevel Optimal

Write-Output "Soumission mise a jour : $archive"
