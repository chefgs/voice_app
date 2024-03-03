from flask import Flask, request
import speech_recognition as sr

app = Flask(__name__)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    audio_file = request.files["audio"]
    recognizer = sr.Recognizer()

    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)
        text = recognizer.recognize_google(audio_data)

    with open("transcription.txt", "a") as file:
        file.write(text + "\n")

    return {"transcription": text}, 200

if __name__ == "__main__":
    app.run(port=5000, debug=True)

@app.route('/create_document', methods=['POST'])
def create_document():
    text = request.json.get('text')

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(40, 10, text)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output, 'F')

    pdf_output.seek(0, 0)
    return send_file(pdf_output, mimetype='application/pdf')

if __name__ == '__main__':
    app.run(port=5001)