const express = require('express');
const router = express.Router();
const multer = require('multer');
const csvController = require('../controllers/csvController');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// CSV conversion route
router.post('/convert', upload.single('csvFile'), (req, res) => 
    csvController.convertCsvToJson(req, res)
);

module.exports = router;


