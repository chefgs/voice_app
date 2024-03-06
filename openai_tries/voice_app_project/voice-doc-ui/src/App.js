import React, { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [documentPath, setDocumentPath] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(audioBlob));
    };
  };

  const saveRecording = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setDocumentPath(response.data.path);
    } catch (error) {
      console.error('Failed to save recording:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        <button onClick={saveRecording} disabled={!audioUrl}>Save Document</button>
        {documentPath && <p>Document created: <a href={`http://localhost:5000/${documentPath}`} target="_blank" rel="noopener noreferrer">Download Document</a></p>}
      </header>
    </div>
  );
}

export default App;
