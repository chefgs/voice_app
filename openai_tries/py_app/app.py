from flask import Flask, jsonify
import speech_recognition as sr
from docx import Document

app = Flask(__name__)

def record_voice():
    # Initialize the recognizer
    r = sr.Recognizer()

    # Use the default microphone as the audio source
    with sr.Microphone() as source:
        print("Please say something...")
        # Listen for the first phrase and extract the audio data
        audio = r.listen(source)

    try:
        # Recognize the speech using Google Web Speech API
        text = r.recognize_google(audio)
        print("You said: " + text)
        return text
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")

def create_document(text):
    # Create a new Document
    doc = Document()
    doc.add_paragraph(text)
    
    # Save the document
    doc_name = "RecordedVoice.docx"
    doc.save(doc_name)
    print(f"Document '{doc_name}' created successfully!")

@app.route('/record', methods=['GET'])
def record_and_create_document():
    recorded_text = record_voice()
    if recorded_text:
        create_document(recorded_text)
        return jsonify(message=f"Document 'RecordedVoice.docx' created successfully!")
    else:
        return jsonify(message="No voice input detected.")

if __name__ == "__main__":
    app.run(debug=True)