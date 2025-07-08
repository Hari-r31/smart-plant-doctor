from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import uuid
import os
import pickle
import json
from datetime import datetime
from dotenv import load_dotenv
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input, decode_predictions
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL_PATH = os.getenv("MODEL_PATH", "plant_dis.h5")
LABEL_PATH = os.getenv("LABEL_PATH", "class_labels.json")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.5))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load models
mobilenet = MobileNetV2(weights="imagenet")
plant_model = load_model(MODEL_PATH)

# Load label mappings
with open(LABEL_PATH, 'r') as f:
    class_indices = json.load(f)
index_to_label = {v: k for k, v in class_indices.items()}

# Plant-related keywords
PLANT_KEYWORDS = [
    "plant", "leaf", "leaves", "tree", "flower", "blossom", "herb", "maize", "corn", "banana", "cabbage",
    "mango", "oak", "shrub", "vine", "sunflower", "tobacco", "strawberry", "vegetable", "fruit", "garden",
    "tomato", "potato", "pepper", "capsicum", "bell pepper", "chili"
]

def load_disease_info():
    with open(r"D:\Study\MTech\Minor_Project\smart-plant-doctor\backend\app\ml\disease_info.json", "r") as f:
        return json.load(f)

# Helper: Check if image is a plant
def is_plant_image(img: Image.Image) -> bool:
    try:
        img_resized = img.resize((224, 224))
        arr = img_to_array(img_resized)
        arr = np.expand_dims(arr, axis=0)
        arr = preprocess_input(arr)

        preds = mobilenet.predict(arr)
        decoded = decode_predictions(preds, top=5)[0]
        top_labels = [label[1].lower() for label in decoded]

        return any(any(keyword in label for keyword in PLANT_KEYWORDS) for label in top_labels)
    except Exception as e:
        print("Plant detection error:", e)
        return False

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Smart Plant Doctor backend is running"}

# Fetch last 10 sensor readings
@app.get("/sensors")
def get_sensor_data():
    try:
        response = supabase.table("sensor_data").select("*").order("timestamp", desc=True).limit(720).execute()
        print(response.data)
        return response.data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sensor data: {str(e)}")

# Predict disease from uploaded image
@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        if not is_plant_image(img):
            raise HTTPException(status_code=400, detail="Not a valid plant image. Upload tomato, potato, or pepper leaf.")

        img_resized = img.resize((224, 224))
        img_array = img_to_array(img_resized)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        predictions = plant_model.predict(img_array)
        predicted_index = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_index])

        if confidence < CONFIDENCE_THRESHOLD:
            raise HTTPException(status_code=400, detail=f"Low confidence prediction ({confidence:.2f})")

        disease_name = index_to_label.get(predicted_index, "Unknown")

        print(disease_name)

        disease_info = load_disease_info()
        info = disease_info.get(disease_name)
        print(info)
        print(f'Symptoms: {info["symptoms"]}, Cause: {info["cause"]}, Precautions: {info["precautions"]}, '
      f'Organic Remedies: {info["organic_remedies"]}, Chemical Treatment: {info["chemical_treatment"]}')


        if not info:
            raise HTTPException(status_code=404, detail="No cure/remedy info found for this disease")                       

        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        bucket = supabase.storage.from_('leaf-images')
        bucket.upload(unique_filename, image_bytes, {"content-type": file.content_type})
        public_url = bucket.get_public_url(unique_filename)

        supabase.table("predictions").insert({
            "image_url": public_url,
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "timestamp": datetime.utcnow().isoformat(),
            "symptoms": info["symptoms"],
            "cause": info["cause"],
            "precautions": info["precautions"],
            "organic_remedies": info["organic_remedies"],
            "chemical_treatment": info["chemical_treatment"]
        }).execute()

        return {
            "disease": disease_name,
            "confidence": confidence,
            "image_url": public_url,
            "symptoms": info["symptoms"],
            "cause": info["cause"],
            "precautions": info["precautions"],
            "organic_remedies": info["organic_remedies"],
            "chemical_treatment": info["chemical_treatment"]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Prediction error:", str(e))
        raise HTTPException(status_code=500, detail="Internal server error")


# Fetch latest 50 predictions
@app.get("/predictions")
def get_predictions():
    try:
        response = supabase.table("predictions").select("*").order("timestamp", desc=True).limit(50).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch predictions: {str(e)}")

# Fetch latest sensor data
@app.get("/live")
def get_live_sensor_data():
    try:
        response = supabase.table("sensor_data").select("*").order("timestamp", desc=True).limit(1).execute()
        return response.data if response.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch live sensor data: {str(e)}")
