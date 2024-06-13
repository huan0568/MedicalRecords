// imageController.js
const Image = require('../models/Image');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = [
    upload.single('image_eyes'),
    async (req, res) => {
        try {
            const { id_patient, isGrayImage } = req.body;
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const newImage = new Image({
                id_patient,
                data: req.file.buffer,
                contentType: req.file.mimetype,
                isGrayImage: isGrayImage === 'true', // Convert string back to boolean
            });

            await newImage.save();
            res.status(201).json(newImage);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
];

exports.getImagesByPatientId = async (req, res) => {
    try {
        const { id_patient } = req.params;
        const images = await Image.find({ id_patient });
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteImageByPatientId = async (req, res) => {
    try {
        const { id_patient } = req.params;
        const result = await Image.deleteMany({ id_patient });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No images found for this patient' });
        }
        res.status(200).json({ message: 'Images deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getGrayImages = async (req, res) => {
    try {
        const { id_patient } = req.params;
        const images = await Image.find({ id_patient, isGrayImage: true });
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getNormalImages = async (req, res) => {
    try {
        const { id_patient } = req.params;
        const images = await Image.find({ id_patient, $or: [{ isGrayImage: false }, { isGrayImage: { $exists: false } }] });
        res.status(200).json(images);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


