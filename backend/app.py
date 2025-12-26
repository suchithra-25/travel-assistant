from flask import Flask, request, jsonify, session
from flask_cors import CORS
from googletrans import Translator, LANGUAGES
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

import requests
import os
from ultralytics import YOLO

# Flask app initialization
app = Flask(__name__)
CORS(app)
translator = Translator()
app.secret_key = "your_secret_key"

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/user_db"
mongo = PyMongo(app)

# Upload folder configuration
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Load YOLOv8 model
model = YOLO("yolov8l.pt")


@app.route('/test')
def test_db():
    user_count = mongo.db.users.count_documents({})
    return {"message": f"Connected to MongoDB! Users Count: {user_count}"}


# User registration
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if mongo.db.users.find_one({"username": username}):
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    mongo.db.users.insert_one({"username": username, "password": hashed_password})
    return jsonify({"message": "Registration successful"}), 201


# User login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = mongo.db.users.find_one({"username": username})
    if user and check_password_hash(user['password'], password):
        session['user'] = username
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"message": "Invalid username or password"}), 401


# User logout
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({"message": "Logged out successfully"}), 200


# Translate text or objects
@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.json
        text = data.get('text')
        objects = data.get("objects", [])
        target_lang = data.get('targetLang', 'en')

        # Handle text translation
        if text:
            translated_text = translator.translate(text, dest=target_lang).text
            return jsonify({"translatedText": translated_text})

        # Handle object translations
        if objects:
            translated_objects = [
                translator.translate(obj, dest=target_lang).text for obj in objects
            ]
            return jsonify({"translatedObjects": translated_objects})

        return jsonify({"error": "No text or objects provided for translation"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get available languages
@app.route('/languages', methods=['GET'])
def get_languages():
    return jsonify(LANGUAGES)


# Audio translation
"""
@app.route('/audio-translate', methods=['POST'])
def audio_translate():
    data = request.json
    text = data.get("text")
    source_lang = data.get("source_language")
    target_lang = data.get("target_language")

    try:
        translation = translator.translate(text, src=source_lang, dest=target_lang)
        return jsonify({"translated_text": translation.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
"""
@app.route('/audio-translate', methods=['POST'])
def audio_translate():
    data = request.json
    text = data.get("text")
    source_lang = data.get("source_language")
    target_lang = data.get("target_language")

    try:
        if not text:
            return jsonify({"translated_text": "No text provided for translation."}), 400

        translation = translator.translate(text, src=source_lang, dest=target_lang)
        return jsonify({"translated_text": translation.text})
    except Exception as e:
        print(f"Translation error: {str(e)}")
        return jsonify({"error": "Failed to translate text. Please try again."}), 500


# Object detection
@app.route("/detect-objects", methods=["POST"])
def detect_objects():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    # Perform object detection
    results = model(filepath)
    detections = results[0].boxes.data.tolist()

    objects = []
    for detection in detections:
        x1, y1, x2, y2, confidence, class_id = detection

        # Filter predictions based on confidence threshold
        if confidence > 0.5:
            objects.append({
                "class": results[0].names[int(class_id)],
                "confidence": confidence,
                "bbox": [x1, y1, x2, y2]
            })

    return jsonify({"objects": objects})


# Fetch place details from Wikipedia
WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"


@app.route("/get-place-details", methods=["GET"])
def get_place_details():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    try:
        params = {
            "action": "query",
            "format": "json",
            "prop": "extracts|pageimages",
            "titles": query,
            "exintro": True,
            "explaintext": True,
            "redirects": 1,
            "pithumbsize": 300,
        }
        response = requests.get(WIKIPEDIA_API_URL, params=params)
        response.raise_for_status()
        data = response.json()

        pages = data.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        if "missing" in page:
            return jsonify({"error": "No details found for the given place."}), 404

        place_details = {
            "title": page.get("title"),
            "description": page.get("extract"),
            "image": page.get("thumbnail", {}).get("source"),
        }
        return jsonify(place_details)

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch place details: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)



