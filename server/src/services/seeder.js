const fs = require('fs');
const path = require('path');
const { ingestPDF } = require('./ingestion');

const SEED_DIR = path.join(__dirname, '../../seed_documents');
const VECTOR_STORE_PATH = path.join(__dirname, '../../vector_store');

const seedInitialPDFs = async () => {
    // 1. Ensure seed directory exists
    if (!fs.existsSync(SEED_DIR)) {
        fs.mkdirSync(SEED_DIR, { recursive: true });
        console.log(`Created seed directory at: ${SEED_DIR}`);
        console.log("Please place your school FCT/PAP PDF files inside this folder.");
        return;
    }

    // 2. Check if vector store already exists (we only seed on fresh database)
    if (fs.existsSync(VECTOR_STORE_PATH)) {
        console.log("Vector store already exists. Skipping startup seeding to prevent duplication.");
        return;
    }

    // 3. Scan for PDF files
    const files = fs.readdirSync(SEED_DIR);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
        console.log(`No PDF files found in seed directory: ${SEED_DIR}`);
        console.log("Add PDF files to this directory to seed the database automatically on startup.");
        return;
    }

    console.log(`Found ${pdfFiles.length} PDF(s) to seed:`, pdfFiles);

    for (const file of pdfFiles) {
        const filePath = path.join(SEED_DIR, file);
        try {
            console.log(`Seeding: ${file}...`);
            const result = await ingestPDF(filePath);
            console.log(`Successfully seeded ${file} (${result.chunks} chunks).`);
        } catch (error) {
            console.error(`Error seeding ${file}:`, error.message);
        }
    }
};

module.exports = {
    seedInitialPDFs
};
