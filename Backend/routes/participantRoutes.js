const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');



router.post('/upload', participantController.upload, participantController.uploadFiles);

router.get('/admin/listes', participantController.getParticipants );

router.delete('/participant/:id', participantController.deleteParticipant );

router.patch('/participant/:id/accept', participantController.acceptedParticipant );

router.put('/participant/actualise', participantController.resetParticipantAccepted );

module.exports = router;