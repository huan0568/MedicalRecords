// Image.js (Model)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    id_patient: { type: String, required: true },
    data: Buffer,
    contentType: String,
    created_at: { type: Date, default: Date.now },
    isGrayImage: { type: Boolean, default: false },
});

module.exports = mongoose.model('Image', ImageSchema);


