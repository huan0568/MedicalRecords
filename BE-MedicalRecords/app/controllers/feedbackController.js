// feedbackController.js
const Feedback = require('../models/Feedback');
const Image = require('../models/Image');
const Patient = require('../models/Patient');

// create
exports.createFeedback = async (req, res) => {
    try {
        console.log('createFeedback')
        const { id_image, mild_value, moderate_value, noDR_value, proliferateDR_value, severe_value, diabetic_Retinopathy, feedback } = req.body;

        const newFeedback = new Feedback({
            id_image,
            mild_value,
            moderate_value,
            noDR_value,
            proliferateDR_value,
            severe_value,
            diabetic_Retinopathy,
            feedback,
        });

        await newFeedback.save();
        // update is_result field in patient
        const image = await Image.findById(id_image);
        const patient = await Patient.findOne({ id_patient: image.id_patient });
        patient.is_result = true;
        await patient.save();
        // res.status(201).json(newFeedback);
        res.status(201).json({ message: 'Feedback created successfully', feedback: newFeedback});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Feedback already exists' });
        }
        console.log(error)
        // res.status(400).json({ error: error.message });
        res.status(400).json({ error: 'Feedback not created', message: error.message});
    }
};

// retrieve
exports.getFeedbacksByImageId = async (req, res) => {
    try {
        console.log('getFeedbacksByImageId')
        const { id_image } = req.params;
        console.log(id_image)
        const feedbacks = await Feedback.find({ id_image });
        // res.status(200).json(feedbacks);
        res.status(200).json({ message: 'Feedbacks retrieved successfully', feedbacks });
    } catch (error) {
        // res.status(400).json({ error: error.message });
        res.status(400).json({ error: 'Feedbacks not retrieved', message: error.message});
    }
};

// retrieve
exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback retrieved successfully', feedback });
    } catch (error) {
        res.status(500).json({ error: 'Feedback not retrieved', message: error.message})
    }
}

// read all
exports.getAllFeedbacks = async (req, res) => {
    try {
        console.log('getAllFeedbacks')
        const feedbacks = await Feedback.find();
        res.status(200).json({ message: 'Feedbacks retrieved successfully', feedbacks });
    } catch (error) {
        res.status(500).json({ error: 'Feedbacks not retrieved', message: error.message})
    }
}

// update
exports.updateFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req
            .params.id, req.body, { new: true });
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback updated successfully', feedback });
    }
    catch (error) {
        res.status(400).json({ error: 'Feedback not updated', message: error.message})
    }
}

// delete
exports.deleteFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        // update is_result field in patient
        const image = await Image.findById(feedback.id_image);
        const patient = await Patient.findOne({ id_patient: image.id_patient });
        const feedbacks = await Feedback.find({ id_image: feedback.id_image });
        if (feedbacks.length === 0) {
            patient.is_result = false;
            await patient.save();
        }
        if (!feedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }
        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Feedback not deleted', message: error.message})
    }
}


