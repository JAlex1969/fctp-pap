const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ingestPDF, ingestURL } = require('../services/ingestion');
const { queryRAG } = require('../services/rag');

const upload = multer({ dest: 'uploads/' });

// Ingest PDF
router.post('/ingest/pdf', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await ingestPDF(req.file.path);
        res.json(result);
    } catch (error) {
        console.error('PDF Ingestion Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ingest URL
router.post('/ingest/url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        const result = await ingestURL(url);
        res.json(result);
    } catch (error) {
        console.error('URL Ingestion Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Chat
router.post('/chat', async (req, res) => {
    try {
        const { prompt, sessionId } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const answer = await queryRAG(prompt, sessionId);
        res.json({ answer });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
