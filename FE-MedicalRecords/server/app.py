from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from PIL import Image
import cv2

# Define Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the new model
new_model = load_model("D://SANG//NAM 4//PBL7//PBL7//FE-MedicalRecords//server//model//modelPBL7.h5")

# Route for predicting diabetic retinopathy
@app.route('/predict_retinopathy', methods=['POST'])
def predict_retinopathy():
    if request.method == 'POST':
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        img_file = request.files['image']
        if img_file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        if img_file:
            # Read and preprocess the image
            img = cv2.imdecode(np.frombuffer(img_file.read(), np.uint8), cv2.IMREAD_COLOR)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (224, 224))
            img = img.astype('float32') / 255.0
            
            # Make prediction
            prediction = new_model.predict(np.array([img]))
            predicted_class = "Diabetic Retinopathy Not Detected" if np.argmax(prediction) == 1 else "Diabetic Retinopathy Detected"
            
            return jsonify({'prediction': predicted_class}), 200
    
    return jsonify({'error': 'Invalid request method'}), 405

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)





