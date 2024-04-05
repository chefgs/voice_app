import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2),
        backgroundColor: '#ffe', // Add a background color
        boxShadow: '0px 6px 6px 6px rgba(0,0,1,0.3)', // Add a box shadow
    },
    button: {
        margin: theme.spacing(1),
    },
    text: {
        marginTop: theme.spacing(2),
        wordWrap: 'break-word',
        padding: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

const VoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.onresult = event => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setText(transcript);
                if (transcript.toLowerCase().includes("stop")) {
                    recognitionInstance.stop();
                    setIsListening(false);
                }
            };
            setRecognition(recognitionInstance);
        } else {
            alert("Speech recognition is not available on this browser.");
        }
    }, []);

    const startListening = () => {
        if (recognition) {
            recognition.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
            sendTextToServer(text);
        }
    };

    const sendTextToServer = (text) => {
        axios.post('https://super-duper-space-chainsaw-jpqrp44j97c4rq-5000.app.github.dev/api/save', { text })
            .then(response => {
                alert('Text saved successfully');
                console.log(response.data);
                setText(''); // Clear text after sending
            })
            .catch(error => {
                console.error("There was an error saving the text:", error);
            });
    };

    const downloadFile = async () => {
        try {
            const response = await axios({
                url: 'https://super-duper-space-chainsaw-jpqrp44j97c4rq-5000.app.github.dev/api/download/latest',
                method: 'GET',
                responseType: 'blob', // Important
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.txt'); //or any other extension
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Typography variant="h4" component="h1">
                Voice Input
            </Typography>
            <Button variant="contained" color="primary" onClick={startListening} disabled={isListening} className={classes.button}>
                Start Speech Recording
            </Button>
            <Button variant="contained" color="secondary" onClick={stopListening} disabled={!isListening} className={classes.button}>
                Stop and Save
            </Button>
            <Button variant="contained" color="default" onClick={downloadFile} className={classes.button}>
                Download File
            </Button>
            <Paper className={classes.paper}>
                <Typography variant="body1" className={classes.text}>
                    {text}
                </Typography>
            </Paper>
        </Paper>
    );
};

export default VoiceInput;
/* import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const VoiceInput = () => {
    const [isListening, setIsListening] = useState(false);
    const [text, setText] = useState('');
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.onresult = event => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');
                setText(transcript);
                if (transcript.toLowerCase().includes("stop")) {
                    recognitionInstance.stop();
                    setIsListening(false);
                }
            };
            setRecognition(recognitionInstance);
        } else {
            alert("Speech recognition is not available on this browser.");
        }
    }, []);

    const startListening = () => {
        if (recognition) {
            recognition.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
            sendTextToServer(text);
        }
    };

    const sendTextToServer = (text) => {
        axios.post('http://localhost:5000/api/save', { text })
            .then(response => {
                alert('Text saved successfully');
                console.log(response.data);
                setText(''); // Clear text after sending
            })
            .catch(error => {
                console.error("There was an error saving the text:", error);
            });
    };

    const downloadFile = async () => {
        try {
            const response = await axios({
                url: 'http://localhost:5000/api/download/latest',
                method: 'GET',
                responseType: 'blob', // Important
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.txt'); //or any other extension
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={startListening} disabled={isListening}>
                Start Listening
            </Button>
            <Button variant="contained" color="secondary" onClick={stopListening} disabled={!isListening}>
                Stop and Save
            </Button>
            <Button variant="contained" color="default" onClick={downloadFile}>
                Download File
            </Button>
            <p>{text}</p>
        </div>
    );
};

export default VoiceInput; */