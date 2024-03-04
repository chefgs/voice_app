import tkinter as tk
import sounddevice as sd
import requests
import numpy as np
import scipy.io.wavfile as wav
import io
import base64

DURATION = 60  # duration of recording in seconds
FS = 44100  # sample rate

app = tk.Tk()

def record_audio():
    print("Recording for {} seconds...".format(DURATION))
    recording = sd.rec(int(DURATION * FS), samplerate=FS, channels=2)
    sd.wait()
    print("Recording complete.")
    wav.write('output.wav', FS, recording)

def send_audio():
    print("Sending audio...")
    with open('output.wav', 'rb') as f:
        audio_data = base64.b64encode(f.read()).decode('utf-8')
        response = requests.post('http://localhost:5000/voice_to_text', data={'audio': audio_data})
        if response.ok:
            with open('file.txt', 'wb') as f:
                f.write(response.content)
            print("Text file downloaded.")
        else:
            print("Error: ", response.text)

record_button = tk.Button(app, text="Record Audio", command=record_audio)
record_button.pack()

send_button = tk.Button(app, text="Send Audio", command=send_audio)
send_button.pack()

app.mainloop()