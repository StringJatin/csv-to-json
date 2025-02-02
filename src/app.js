const express = require('express');
const multer = require('multer');
const CSVToJSON = require('./csvToJson');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('csvfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;

    const csvToJson = new CSVToJSON({
        delimiter: req.body.delimiter || ',', // Allow custom delimiter
        supportQuotedFields: req.body.supportQuotedFields === 'true', // Allow quoted fields
        formatValueByType: req.body.formatValueByType === 'true', // Format values by type
    });

    try {
        const json = csvToJson.convertFile(filePath);
        res.json(json);
    } catch (error) {
        res.status(500).send('Error processing CSV file: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});