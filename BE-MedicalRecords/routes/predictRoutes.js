// predictRoutes.js
const express = require('express');
const router = express.Router();
const predictController = require('../app/controllers/predictController');

router.post('/create', predictController.createPrediction);
router.get('/image/:id_image', predictController.getPredictionsByImageId);

module.exports = router;
