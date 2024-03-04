from flask import Flask, request, send_file
import os
import speech_recognition as sr
# import base64
import tempfile

app = Flask(__name__)

@app.route('/voice_to_text', methods=['POST'])
def voice_to_text():
    # Get audio data from request
    audio_data = request.form['audio']
    
    # Save audio file temporarily
    with tempfile.NamedTemporaryFile(delete=True) as temp_audio:
        temp_audio.write(audio_data)
        temp_audio.flush()

        # Initialize recognizer class (for recognizing the speech)
        r = sr.Recognizer()

        # Reading audio file as source
        # listening the speech and store in audio_text variable
        with sr.AudioFile(temp_audio.name) as source:
            audio_text = r.record(source)

        # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
        try:
            # using google speech recognition
            text = r.recognize_google(audio_text)

            # Create a file
            with open('file.txt', 'w') as f:
                f.write(text)

        except:
            return "Sorry, I did not get that", 400

    return send_file('file.txt', as_attachment=True)

if __name__ == '__main__':
    app.run(port=5000)