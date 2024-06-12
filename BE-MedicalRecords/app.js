const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors module
require('dotenv').config();

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Database connected successfully'))
//   .catch(err => console.error('Database connection error:', err));

mongoose.connect("mongodb+srv://pbl7eye:qOTmUD1LZvazIIiN@pbl7-db.iqtlenz.mongodb.net/medicalRecord_db?retryWrites=true&w=majority&appName=pbl7-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const patientRoutes = require('./routes/patientRoutes');
const imageRoutes = require('./routes/imageRoutes');
const predictRoutes = require('./routes/predictRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS for all routes
app.use('/patients', patientRoutes);
app.use('/images', imageRoutes);
app.use('/predictions', predictRoutes);
app.use('/feedbacks', feedbackRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

