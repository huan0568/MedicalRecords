// patientController.js
const Patient = require('../models/Patient');
const Image = require('../models/Image');
const Feedback = require('../models/Feedback');

// create
exports.createPatient = [
    async (req, res) => {
        try {
            const { id_patient, name, email, phone, age, address } = req.body;

            const newPatient = new Patient({
                id_patient,
                name,
                email,
                phone,
                age,
                address,
            });

            await newPatient.save();
            res.status(201).json(newPatient);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

// read all
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json( patients );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// retrieve by id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// retrieve by id_patient
exports.getPatientByIdPatient = async (req, res) => {
  try {
    const patient
      = await Patient.findOne({ id_patient: req.params.id_patient });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePatientById = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body.data, { new: true });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    console.log(patient)

    res.json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePatientById = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findPatientByIsResult = async (req, res) => {
  try {
    const patients = await Patient.find({ is_result: req.params.is_result });
    res.status(200).json({ message: 'Patients find patient by id_result successfully', patients: patients });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.searchPatient = async (req, res, next) => {
  try {
    console.log('searchPatient');
    console.log(req.params.key);
    // if req.params.key is number
    var conditions;
    if (!isNaN(req.params.key)) {
      conditions = [
        { id_patient: req.params.key },
        { name: { $regex: req.params.key, $options: 'i' } },
        { age: req.params.key },
        { address: { $regex: req.params.key, $options: 'i' } },
        { phone: req.params.key },
        { email: req.params.key }
      ]
    }
    // else 
    else {
      conditions = [
        { id_patient: req.params.key },
        { name: { $regex: req.params.key, $options: 'i' } },
        { address: { $regex: req.params.key, $options: 'i' } },
        { phone: req.params.key },
        { email: req.params.key }
      ]
    }
    Patient.find({ $or: conditions }).exec()
      .then(patients => {
        res.status(200).json({ 'patients': patients })
      })
      .catch(next);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
