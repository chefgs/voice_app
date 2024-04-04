const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');

router.post('/save', (req, res) => {
    const { text } = req.body;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const filename = `text-${timestamp}.txt`.replace(/[:.]/g, '-');
    
    const directory = './saved_texts/';
    if (!fs.existsSync(directory)){
        fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFile(`${directory}${filename}`, text, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the file');
        }
        res.send({ message: 'File saved successfully', filename });
    });
});

/* router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'saved_texts', filename);
    res.download(filePath, filename, function(err){
        if (err){
            // Handle error, file might not exist etc.
            console.log(err);
            res.status(500).send('Error downloading the file');
        }
    });
}); */

router.get('/download/latest', async (req, res) => {
    const directoryPath = './saved_texts/';
    const readdir = util.promisify(fs.readdir);
    try {
        const files = await readdir(directoryPath);
        const sortedFiles = files.sort((a, b) => fs.statSync(path.join(directoryPath, b)).mtime.getTime() - fs.statSync(path.join(directoryPath, a)).mtime.getTime());
        const latestFile = sortedFiles[0];
        const filePath = path.join(directoryPath, latestFile);
        res.download(filePath, latestFile);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error downloading the file');
    }
});

module.exports = router;