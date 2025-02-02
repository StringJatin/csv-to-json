const csvToJson = require('convert-csv-to-json');
const fs = require('fs');

class CsvController {
    async convertCsvToJson(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const filePath = req.file.path;
            const config = this.parseConfig(req.query);
            const jsonArray = this.processFile(filePath, config);

            // Clean up uploaded file
            fs.unlinkSync(filePath);

            res.json(jsonArray);
        } catch (error) {
            // Clean up on error
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            res.status(500).json({ error: error.message });
        }
    }

    parseConfig(query) {
        return {
            delimiter: query.delimiter || ',',
            hasQuotes: query.hasQuotes === 'true',
            formatValues: query.formatValues === 'true',
            encoding: query.encoding || 'utf8',
            headerIndex: parseInt(query.headerIndex) || 0
        };
    }

    processFile(filePath, config) {
        let converter = csvToJson.fieldDelimiter(config.delimiter);

        if (config.hasQuotes) {
            converter = converter.supportQuotedField(true);
        }

        if (config.formatValues) {
            converter = converter.formatValueByType();
        }

        switch (config.encoding) {
            case 'utf8':
                converter = converter.utf8Encoding();
                break;
            case 'latin1':
                converter = converter.latin1Encoding();
                break;
            case 'ascii':
                converter = converter.asciiEncoding();
                break;
        }

        return converter.getJsonFromCsv(filePath);
    }
}

module.exports = new CsvController();