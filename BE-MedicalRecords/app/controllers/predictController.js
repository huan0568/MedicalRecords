// predictController.js
const Predict = require('../models/Predict');

exports.createPrediction = async (req, res) => {
    try {
        console.log('createPrediction')
        const { id_image, mild_value, moderate_value, noDR_value, proliferateDR_value, severe_value, diabetic_Retinopathy } = req.body;

        const newPrediction = new Predict({
            id_image,
            mild_value,
            moderate_value,
            noDR_value,
            proliferateDR_value,
            severe_value,
            diabetic_Retinopathy,
        });

        await newPrediction.save();
        res.status(201).json(newPrediction);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};

exports.getPredictionsByImageId = async (req, res) => {
    try {
        const { id_image } = req.params;
        const predictions = await Predict.find({ id_image });
        res.status(200).json(predictions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

