const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors module

mongoose.connect("mongodb+srv://pbl7eye:qOTmUD1LZvazIIiN@pbl7-db.iqtlenz.mongodb.net/medicalRecord_db?retryWrites=true&w=majority&appName=pbl7-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const patientRoutes = require('./routes/patientRoutes');
const imageRoutes = require('./routes/imageRoutes');
const predictRoutes = require('./routes/predictRoutes');

app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS for all routes
app.use('/patients', patientRoutes);
app.use('/images', imageRoutes);
app.use('/predictions', predictRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

