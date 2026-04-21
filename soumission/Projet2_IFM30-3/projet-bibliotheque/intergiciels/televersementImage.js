const fs = require("fs");
const path = require("path");
const multer = require("multer");

const dossierTeleversement = path.join(
  __dirname,
  "..",
  "public",
  "televersements"
);

if (!fs.existsSync(dossierTeleversement)) {
  fs.mkdirSync(dossierTeleversement, { recursive: true });
}

function nettoyerNomFichier(nom) {
  return nom
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
}

const stockage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, dossierTeleversement);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "image", extension);
    const nomFichier =
      Date.now() + "-" + nettoyerNomFichier(base || "image") + extension;
    callback(null, nomFichier);
  },
});

function filtrerImage(req, file, callback) {
  if (!file.mimetype.startsWith("image/")) {
    return callback(new Error("Le fichier doit etre une image."));
  }

  return callback(null, true);
}

module.exports = multer({
  storage: stockage,
  fileFilter: filtrerImage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
