const { v4: uuidv4 } = require("uuid");
const Participant = require("../models/participants");
const { where } = require("sequelize");


async function createParticipant(pdfPath, instru_mp3Path, akapela_mp3Path, final_mp3Path) {
    const participantID = Math.floor(1000 + Math.random() * 9999);

    const participant = await Participant.create({
        id: participantID,
        pdf: pdfPath,
        instru_mp3: instru_mp3Path,
        akapela_mp3: akapela_mp3Path,
        final_mp3: final_mp3Path,
        status: "non traiter",
        timestamp: new Date(),
    })

    return participant;
}


async function getAllParticipants() {
    return await Participant.findAll();
}

async function getParticipantById(id) {
    return await Participant.findByPk(id);
}

async function acceptedParticipant(id) {
    const participant = await Participant.findByPk(id);

    if(!participant){
        throw new Error("participant introvable");
    }

    participant.status = "accepter";
    await participant.save();

    return participant;
}

async function deleteParticipant(id) {
    const participant = await Participant.findByPk(id);
    if(!participant){
        throw new Error("participant introvable")
    }

    participant.status = "rejeter";
    await participant.save();

    return participant;
}

async function markAsRead(id) {
    const participant = await Participant.findByPk(id);
    if(!participant){
        throw new Error("participant introvable")
    }

    participant.status = "en traitement";
    await participant.save();

    return participant;
}


async function resetParticipantAccepted() {
    await Participant.update(
        { status: "non traiter"},
        { where: { status: "accepter"}}
    );

    return await Participant.findAll();
}

module.exports = { createParticipant, getAllParticipants, markAsRead, acceptedParticipant, deleteParticipant, getParticipantById, resetParticipantAccepted };