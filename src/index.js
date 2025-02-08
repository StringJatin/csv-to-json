const express = require('express');
const multer = require('multer');
const CSVToJSON = require('./csvToJson');

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

app.post('/convert', upload.single('csvfile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const csvData = req.file.buffer.toString('utf-8'); 

    const csvToJson = new CSVToJSON({
        delimiter: req.body.delimiter || ',', 
        supportQuotedFields: req.body.supportQuotedFields === 'true',
        formatValueByType: req.body.formatValueByType === 'true', 
    });

    try {
        const json = csvToJson.convert(csvData); 
        res.json(json);
    } catch (error) {
        res.status(500).send('Error processing CSV file: ' + error.message);
    }
});

module.exports = app; 
