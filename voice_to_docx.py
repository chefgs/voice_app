from flask import Flask, request
from flask import send_file
import speech_recognition as sr
from docx import Document
import base64
import io

app = Flask(__name__)

@app.route('/voice_to_text', methods=['POST'])
def voice_to_text():
    # Get audio data from request
    audio_data = base64.b64decode(request.form['audio'])

    # Convert audio to text
    text = get_voice_input(audio_data)

    # Create document
    if text is not None:
        filename = "output.docx"
        create_document(text, filename)

        # Return the file as an attachment
        return send_file(filename, as_attachment=True)

    return "No text recognized", 400

def get_voice_input(audio_data):
    # Initialize recognizer class (for recognizing the speech)
    recognizer = sr.Recognizer()

    # Convert audio to text
    with sr.AudioFile(io.BytesIO(audio_data)) as source:
        audio_text = recognizer.record(source)

    try:
        # using google speech recognition
        return recognizer.recognize_google(audio_text)
    except:
        return None

def create_document(text, filename):
    doc = Document()
    doc.add_paragraph(text)
    doc.save(filename)

if __name__ == '__main__':
    app.run(debug=True)