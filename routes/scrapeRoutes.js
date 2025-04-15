// routes/scrapeRoutes.js
const express = require('express');
const router = express.Router();
const scrapeJobs = require('../scrapeJobs');

router.get('/scrape-jobs', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
    }

    try {
        const jobs = await scrapeJobs(query);
        res.json(jobs);

    } catch (err) {
        console.error('❌ Error scraping jobs:', err);
        res.status(500).json({ error: 'Failed to scrape jobs' });
    }
});

module.exports = router;
