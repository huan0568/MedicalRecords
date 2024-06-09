// Feedback.js (Model)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    id_image: { type: String, required: true },
    mild_value: { type: Number, required: true },
    moderate_value: { type: Number, required: true },
    noDR_value: { type: Number, required: true },
    proliferateDR_value: { type: Number, required: true },
    severe_value: { type: Number, required: true },
    diabetic_Retinopathy: { type: String, required: true },
    feedback: { type: String, maxLength: 255 },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);



