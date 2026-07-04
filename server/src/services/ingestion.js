const fs = require('fs');
const pdf = require('pdf-parse');
const cheerio = require('cheerio');
const { addDocumentsToStore } = require('./rag');

const ingestPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        const text = data.text;

        // Clean up the uploaded file if needed, or keep it
        // fs.unlinkSync(filePath); 

        const count = await addDocumentsToStore(text);
        return { message: 'PDF Ingested successfully', chunks: count };
    } catch (error) {
        throw new Error(`Failed to ingest PDF: ${error.message}`);
    }
};

const ingestURL = async (url) => {
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove scripts and styles
        $('script').remove();
        $('style').remove();

        // Get text
        const text = $('body').text().replace(/\s+/g, ' ').trim();

        const count = await addDocumentsToStore(text);
        return { message: 'URL Ingested successfully', chunks: count };
    } catch (error) {
        throw new Error(`Failed to ingest URL: ${error.message}`);
    }
};

module.exports = {
    ingestPDF,
    ingestURL
};
