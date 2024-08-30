from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model # type: ignore
from tensorflow.keras.preprocessing import image # type: ignore
from tensorflow.keras.applications.vgg16 import preprocess_input # type: ignore
from PIL import Image
import numpy as np
from io import BytesIO
import base64
import os
from flask_cors import CORS
from groq import Groq # type: ignore

app = Flask(__name__)
CORS(app, origins=['*'], methods=['POST', 'GET'], headers=['Content-Type'])  # Allow CORS from all origins

model = load_model('second.keras')
train2_path = 'train1'

api_key = "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"  
client = Groq(api_key=api_key)

def get_class_name(idx):
    classes = sorted(os.listdir(train2_path))
    return classes[idx]

@app.route('/')
def home():
    return "<h1>Welcome to the Image Classification</h1>"

@app.route('/input', methods=['POST'])
def get_input():
    user_input = request.json
    response = {
        "message": "Input received",
        "received_data": user_input
    }
    return jsonify(response)

@app.route('/predict', methods=['POST'])
def predict():
    print('Incoming image request...')

    data = request.get_json()
    image_base64 = data.get('image')

    if not image_base64:
        return jsonify({'error': 'No image data provided'}), 400  # Return a 400 Bad Request error

    try:
        # Decode the base64 string
        image_data = base64.b64decode(image_base64)
        img = Image.open(BytesIO(image_data))
        
        # Preprocess the image
        img = img.resize((224, 224))  # Resize the image to the required size
        x = np.array(img)
        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        # Predict the class
        predictions = model.predict(x)
        predicted_class_index = np.argmax(predictions)
        predicted_class_name = get_class_name(predicted_class_index)

        return jsonify({
            'predicted_class_index': int(predicted_class_index),
            'predicted_class_name': predicted_class_name
        })
    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': 'Failed to process image'}), 500 
    
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data.get('message')
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
            }
        ],
        model="llama3-8b-8192",
    )
    
    response_content = chat_completion.choices[0].message.content
    return jsonify({"response": response_content})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')


