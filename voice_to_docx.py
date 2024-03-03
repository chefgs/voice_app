from flask import Flask, render_template, request
import speech_recognition as sr
from docx import Document

app = Flask(__name__)

#@app.route('/')
#def home():
#    return render_template('index.html')

@app.route('/voice_to_text', methods=['POST'])
def voice_to_text():
    # Get audio file from request
    audio_file = request.files['audio']

    # Convert audio to text
    text = get_voice_input(audio_file)

    # Create document
    if text is not None:
        create_document(text, "output.docx")

    return "Document created successfully", 200

def get_voice_input(audio_file):
    # Initialize recognizer class (for recognizing the speech)
    recognizer = sr.Recognizer()

    # Convert audio to text
    with sr.AudioFile(audio_file) as source:
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
    app.run(debug=True, port=5000)