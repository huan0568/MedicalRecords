// imageController.js
const Image = require('../models/Image');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.uploadImage = [
    upload.single('image_eyes'),
    async (req, res) => {
        try {
            const { id_patient } = req.body;
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const newImage = new Image({
                id_patient,
                data: req.file.buffer,
                contentType: req.file.mimetype,
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