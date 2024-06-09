// feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../app/controllers/feedbackController');

router.post('/create', feedbackController.createFeedback);
router.get('/image/:id_image', feedbackController.getFeedbacksByImageId);
router.get('/:id', feedbackController.getFeedbackById);
router.put('/update/:id', feedbackController.updateFeedbackById);
router.delete('/delete/:id', feedbackController.deleteFeedbackById);
router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;
