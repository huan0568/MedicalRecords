const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema({
    id_patient: { type: String },
    name: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255 },
    // gender: { type: Boolean },  // true: nam - false: nữ
    phone: { type: String, maxLength: 15 },
    age: { type: Number },
    address: { type: String, maxLength: 255 },
    is_result: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', PatientSchema);
