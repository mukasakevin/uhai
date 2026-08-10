/**
 * public.js — Routes API publiques (sans authentification).
 * GET /api/causes
 * GET /api/site-content
 */

const express = require('express');
const path    = require('path');
const fs      = require('fs').promises;
const { getCauses } = require('../db');

const router = express.Router();

// GET /api/causes — Liste des objectifs/causes
router.get('/causes', async (req, res) => {
    try {
        const causes = await getCauses();
        res.json(causes);
    } catch (err) {
        console.error('Erreur /api/causes :', err.message);
        res.status(500).json({ error: 'Erreur lors du chargement des causes.' });
    }
});

// GET /api/site-content — Configuration CMS globale du site
router.get('/site-content', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', '..', 'data', 'site_content.json');
        const data = await fs.readFile(filePath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.error('Erreur /api/site-content :', err.message);
        res.status(500).json({ error: 'Erreur lors de la lecture du contenu du site.' });
    }
});

module.exports = router;
