const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PatientSchema = new Schema ({
    id_patient: {type: String},
    name: {type : String, maxLength: 255},
    email: {type : String, maxLength: 255},
    phone: {type : String, maxLength: 15},
    age: {type : Number},
    address: {type : String, maxLength: 255},
    create_at: {type : Date, default : Date.now},
    image_eyes: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Patient', PatientSchema);

