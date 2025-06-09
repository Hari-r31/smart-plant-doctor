from fastapi import FastAPI, UploadFile, File
from supabase import create_client, Client
from PIL import Image
import numpy as np
import io
import uuid
import os
import pickle
from datetime import datetime
from dotenv import load_dotenv
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
import httpx
from fastapi import HTTPException

from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
MODEL_PATH = os.getenv("MODEL_PATH")
LABEL_PATH = os.getenv("LABEL_PATH")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

model = load_model(MODEL_PATH)

with open(LABEL_PATH, "rb") as f:
    label_binarizer = pickle.load(f)
CLASS_NAMES = label_binarizer.classes_.tolist()

@app.get("/")
def read_root():
    return {"message": "Smart Plant Doctor backend is running"}

@app.get("/sensors")
def get_sensor_data():
    try:
        response = supabase.table("sensor_data").select("*").order("timestamp", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        return {"error": f"Failed to fetch sensor data: {str(e)}"}



@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((64, 64))
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0

    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions[0])
    disease_name = CLASS_NAMES[predicted_class]

    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    bucket = supabase.storage.from_('leaf-images')
    bucket.upload(unique_filename, image_bytes, {"content-type": file.content_type})
    public_url = bucket.get_public_url(unique_filename)

    data = {
        "image_url": public_url,
        "disease": disease_name,
        "timestamp": datetime.utcnow().isoformat()
    }
    supabase.table("predictions").insert(data).execute()

    return {"disease": disease_name, "image_url": public_url}


@app.get("/predictions")
def get_predictions():
    try:
        response = supabase.table("predictions").select("*").order("timestamp", desc=True).limit(10).execute()
        # response.data is a list of predictions
        return response.data
    except Exception as e:
        return {"error": f"Failed to fetch predictions: {str(e)}"}
    
@app.get("/live")
def get_live_sensor_data():
    try:
        response = supabase.table("sensor_data").select("*").order("timestamp", desc=True).limit(1).execute()
        if not response.data:
            return []
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch predictions: {str(e)}")
    
#uvicorn app.main:app
