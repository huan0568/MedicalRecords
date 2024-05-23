const express = require('express');
const router = express.Router();
const patientController = require('../app/controllers/patientController');

router.post('/create', patientController.createPatient);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.get('/find/:id_patient', patientController.getPatientById);
router.put('/update/:id', patientController.updatePatientById);
router.delete('/delete/:id', patientController.deletePatientById);

module.exports = router;




