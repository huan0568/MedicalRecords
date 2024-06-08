from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import cv2

# Define Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the new model
new_model = load_model("D://SANG//NAM 4//PBL7//PBL7//FE-MedicalRecords//server//model//newmodelPBL7.h5")

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
            try:
                # Read and preprocess the image
                img = cv2.imdecode(np.frombuffer(img_file.read(), np.uint8), cv2.IMREAD_COLOR)
                img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                img = cv2.resize(img, (224, 224))
                img = img.astype('float32') / 255.0
                
                # Make prediction using the new model
                prediction = new_model.predict(np.array([img]))
                
                # Return the prediction as a list of numerical values
                return jsonify({'prediction': prediction.tolist()}), 200
            except Exception as e:
                print("Error processing image:", e)
                return jsonify({'error': 'Error processing image'}), 500
    
    return jsonify({'error': 'Invalid request method'}), 405

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)






