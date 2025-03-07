const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const authMiddleware = require("../middleware/authMiddleware");



router.post('/upload', participantController.upload, participantController.uploadFiles);

router.get('/admin/listes',authMiddleware, participantController.getParticipants );

router.delete('/participant/:id', authMiddleware, participantController.deleteParticipant , );

router.patch('/participant/:id/accept', authMiddleware, participantController.acceptedParticipant,  );

router.put('/participant/actualise', authMiddleware, participantController.resetParticipantAccepted,  );

module.exports = router;