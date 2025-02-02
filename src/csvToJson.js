const fs = require('fs');
const path = require('path');

class CSVToJSON {
    constructor(options = {}) {
        this.delimiter = options.delimiter || ','; 
        this.supportQuotedFields = options.supportQuotedFields || false;
        this.formatValueByType = options.formatValueByType || false;
    }

    // Parse a CSV string into an array of objects
    parse(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim() !== ''); // Remove empty lines
        if (lines.length === 0) return [];

        const headers = this.parseLine(lines[0]);
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseLine(lines[i]);
            const row = {};

            for (let j = 0; j < headers.length; j++) {
                let value = values[j] || '';
                if (this.formatValueByType) {
                    value = this.formatValue(value);
                }
                row[headers[j]] = value;
            }

            result.push(row);
        }

        return result;
    }

    // Parse a single line of CSV data
    parseLine(line) {
        if (this.supportQuotedFields) {
            return this.parseLineWithQuotes(line);
        }
        return line.split(this.delimiter).map(item => item.trim());
    }

    // Handle quoted fields in CSV
    parseLineWithQuotes(line) {
        const regex = new RegExp(`(".*?"|[^"${this.delimiter}]+)(?=${this.delimiter}|$)`, 'g');
        return line.match(regex).map(item => item.trim().replace(/^"|"$/g, ''));
    }

    // Format value by type (number, boolean, etc.)
    formatValue(value) {
        if (!isNaN(value)) {
            return parseFloat(value); // Convert to number
        } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            return value.toLowerCase() === 'true'; // Convert to boolean
        }
        return value; // Return as string
    }

    // Read a CSV file and convert it to JSON
    convertFile(filePath) {
        const csvData = fs.readFileSync(filePath, 'utf8');
        return this.parse(csvData);
    }
}

module.exports = CSVToJSON;