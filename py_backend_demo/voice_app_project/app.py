from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import speech_recognition as sr
import os

app = Flask(__name__)
# CORS(app)  # Enable CORS if you're calling the API from a different domain
CORS(app, resources={r"/upload": {"origins": "http://localhost:3001"}})

# Directory where uploaded files will be saved
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Directory for saving text documents
DOCUMENTS_FOLDER = 'documents'
os.makedirs(DOCUMENTS_FOLDER, exist_ok=True)

def transcribe_audio(audio_path):
    """Transcribe the given audio file to text."""
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
            return text
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            return f"Speech recognition request failed; {e}"

def create_document(text, filename="transcribed_text.txt"):
    """Create a text document from the transcribed text."""
    document_path = os.path.join(DOCUMENTS_FOLDER, filename)
    with open(document_path, "w") as file:
        file.write(text)
    return document_path

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio = request.files['audio']
    filename = audio.filename
    audio_save_path = os.path.join(UPLOAD_FOLDER, filename)
    audio.save(audio_save_path)

    # Transcribe the audio to text
    transcribed_text = transcribe_audio(audio_save_path)

    # Create a document from the transcribed text
    document_path = create_document(transcribed_text, filename.replace('.webm', '.txt'))

    return jsonify({"message": "Document created successfully", "document_path": document_path}), 200

@app.route('/documents/<filename>', methods=['GET'])
def get_document(filename):
    """Serve a document file from the DOCUMENTS_FOLDER."""
    return send_from_directory(DOCUMENTS_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
