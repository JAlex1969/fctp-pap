const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { seedInitialPDFs } = require('./services/seeder');

app.use('/api', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("Checking for FCT/PAP documents to seed...");
    try {
        await seedInitialPDFs();
    } catch (e) {
        console.error("Startup seeding failed:", e.message);
    }
});
