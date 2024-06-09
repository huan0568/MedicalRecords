const express = require('express');
const router = express.Router();
const patientController = require('../app/controllers/patientController');

router.post('/create', patientController.createPatient);
router.get('/:id', patientController.getPatientById);
router.get('/find/:id_patient', patientController.getPatientByIdPatient);
router.put('/update/:id', patientController.updatePatientById);
router.delete('/delete/:id', patientController.deletePatientById);
router.get('/result/:is_result', patientController.findPatientByIsResult);
router.get('/search/:key', patientController.searchPatient);
router.get('/', patientController.getAllPatients);

module.exports = router;




