// imageRoutes.js
const express = require('express');
const router = express.Router();
const imageController = require('../app/controllers/imageController');

router.post('/upload', imageController.uploadImage);
router.get('/patient/:id_patient', imageController.getImagesByPatientId);
router.delete('/delete/patient/:id_patient', imageController.deleteImageByPatientId);

module.exports = router;
