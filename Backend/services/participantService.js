const { v4: uuidv4 } = require("uuid");
const Participant = require("../models/participants");
const { where } = require("sequelize");


async function createParticipant(pdfPath, mp3Path) {
    const participantID = Math.floor(1000 + Math.random() * 9999);

    const participant = await Participant.create({
        id: participantID,
        pdf: pdfPath,
        mp3: mp3Path,
        timestamp: new Date(),
    })

    return participant;
}


async function getAllParticipants() {
    return await Participant.findAll();
}

async function deleteParticipant(id) {
await Participant.destroy(
    {where: {id}}
    
);
console.log(id)
}

async function getParticipantById(id) {
    return await Participant.findByPk(id);
}

async function resetParticipantAccepted() {
    await Participant.update(
        { accepted: false},
        { where: { accepted: true}}
    );

    return await Participant.findAll();
}

module.exports = { createParticipant, getAllParticipants, deleteParticipant, getParticipantById, resetParticipantAccepted };