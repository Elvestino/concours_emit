const path = require("path");
const multer = require("multer");
const fs = require("fs");
const participantService = require("../services/participantService");
const Participant = require("../models/participants");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    const filename = `${timestamp} ${nameWithoutExt} ${ext}`;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: "pdf", maxCount: 1 },
  { name: "instru_mp3", maxCount: 1 },
  { name: "akapela_mp3", maxCount: 1 },
  { name: "final_mp3", maxCount: 1 },
]);

async function downloadFile(req, res) {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).send("Fichier non trouvé");
    }
  });
}

async function uploadFiles(req, res) {
  try {
    if (!req.files || !req.files["pdf"] || !req.files["instru_mp3"] || !req.files["akapela_mp3"] || !req.files["final_mp3"] ) {
      return res.status(400).json({ error: "Fichiers PDF et MP3 requis" });
    }

    const pdfPath = req.files["pdf"][0].path;
    const instru_mp3Path = req.files["instru_mp3"][0].path;
    const akapela_mp3Path = req.files["akapela_mp3"][0].path;
    const final_mp3Path = req.files["final_mp3"][0].path;

    const participant = await participantService.createParticipant(
      pdfPath,
      instru_mp3Path,
      akapela_mp3Path,
      final_mp3Path
    );

    res.json({ participantID: participant.id });
  } catch (error) {
    console.error("Erreur ajout", error);
    res.status(500).send("Erreur serveur");
  }
}

async function getParticipants(req, res) {
  try {
    const participants = await participantService.getAllParticipants();
    res.json(participants);
  } catch (error) {
    console.error("erreur de la recuperation des participants");
    res.status(500).send("erreur serveur");
  }
}

async function deleteParticipant(req, res) {
  const { id } = req.params;

  try {
    const participant = await participantService.deleteParticipant(id);

    req.io.emit("participantRejected", { id: participant.id, status:"rejeter" });

    res.send("participant et fichier refuser");
  } catch (error) {
    console.error("erreur de la suppression");
    res.status(500).send("erreur serveur");
  }
}

async function acceptedParticipant(req, res) {
  const { id } = req.params;
  try {
    const participant = await participantService.acceptedParticipant(id);

    req.io.emit("participantAccepted", { id: participant.id, status: "accepter" });

    res.json({ message: "Participant accepter", participant });
  } catch (error) {
    console.error("erreur de la recuperation des participants", error);
    res.status(500).send("erreur serveur");
  }
}

async function resetParticipantAccepted(req, res) {
  try {
    const actualise = await participantService.resetParticipantAccepted();

    req.io.emit(
      "participantReset",
       { status: "non traiter" }
    );

    res.json({
      message: " totes les participant accepter sont reinitialiser",
      participants: actualise,
    });
  } catch (error) {
    console.error("erreur de la recuperation des participants", error);
    res.status(500).send("erreur serveur");
  }
}

async function markAsInProgress(req, res) {
  const {id} = req.params;

  try {
    const participant = await participantService.markAsRead(id);

    req.io.emit("participantInProgress", {id: participant.id, status: "en traitement"});
    res.json({message:" en cours de traitement", participant})
  }catch(error) {
    console.error("erreurlors de la mis a jours du status", error);
    res.status(500).send("erreur serveur");
  }
}

module.exports = {
  uploadFiles,
  getParticipants,
  upload,
  downloadFile,
  deleteParticipant,
  acceptedParticipant,
  resetParticipantAccepted,
  markAsInProgress
};
