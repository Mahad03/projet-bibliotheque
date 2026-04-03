$racine = "C:\Users\lemah\Documents\Playground"
$dossierSoumission = "$racine\soumission\Projet1_IFM30-3"
$zipFinal = "$racine\soumission\Projet1_IFM30-3.zip"

# Nettoyer et recreer le dossier
if (Test-Path $dossierSoumission) {
    Remove-Item $dossierSoumission -Recurse -Force
}
New-Item $dossierSoumission -ItemType Directory | Out-Null

# Copier le projet sans dossiers/fichiers techniques ou prives
$exclusions = @("node_modules", ".git", "soumission", "quiz-builder-react", ".env", "output", ".codex", ".playwright-cli")
Get-ChildItem $racine | Where-Object { $exclusions -notcontains $_.Name } | ForEach-Object {
    Copy-Item $_.FullName -Destination $dossierSoumission -Recurse -Force
}

# Copier les fichiers de soumission specifiques
Copy-Item "$racine\soumission\modele-entite-association.pdf" "$dossierSoumission\modele-entite-association.pdf" -Force
Copy-Item "$racine\soumission\modele-physique.pdf" "$dossierSoumission\modele-physique.pdf" -Force
Copy-Item "$racine\collection_postman.json" "$dossierSoumission\collection_postman.json" -Force
Copy-Item "$racine\soumission\infos-soumission.txt" "$dossierSoumission\infos-soumission.txt" -Force

# Creer le zip
if (Test-Path $zipFinal) { Remove-Item $zipFinal -Force }
Compress-Archive -Path $dossierSoumission -DestinationPath $zipFinal -CompressionLevel Optimal

Write-Host "Zip cree : $zipFinal"

# Verifier le contenu
$zip = [System.IO.Compression.ZipFile]::OpenRead($zipFinal)
$fichiers = $zip.Entries | Select-Object -ExpandProperty FullName
$zip.Dispose()

Write-Host "`nContenu du zip ($($fichiers.Count) entrees):"
$fichiers | Where-Object { $_ -notmatch "node_modules" } | Select-Object -First 40 | ForEach-Object { Write-Host "  $_" }

# Verifier les fichiers cles
$cles = @("modele-entite-association.pdf", "modele-physique.pdf", "collection_postman.json", "infos-soumission.txt")
Write-Host "`nVerification fichiers cles:"
foreach ($f in $cles) {
    $present = $fichiers | Where-Object { $_ -like "*$f*" }
    if ($present) { Write-Host "  [OK] $f" } else { Write-Host "  [ABSENT] $f" }
}
