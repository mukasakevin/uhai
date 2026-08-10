/**
 * admin.js — Routes API d'administration (authentification requise).
 * POST   /api/admin/login
 * GET    /api/admin/causes
 * POST   /api/admin/causes
 * PUT    /api/admin/causes/:id
 * DELETE /api/admin/causes/:id
 * GET    /api/admin/site-content  (alias de PUT)
 * PUT    /api/admin/site-content
 * POST   /api/admin/upload
 */

const express = require('express');
const path    = require('path');
const fs      = require('fs').promises;
const { getCauses, saveCause, deleteCause } = require('../db');
const { checkAdminAuth } = require('../middleware/auth');

const router = express.Router();

// ─── Authentification ─────────────────────────────────────────────────────────

// POST /api/admin/login
router.post('/login', (req, res) => {
    const { password }  = req.body;
    const adminPass     = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPass) return res.json({ token: adminPass });
    return res.status(401).json({ error: 'Mot de passe incorrect.' });
});

// ─── CRUD Causes ─────────────────────────────────────────────────────────────

// GET /api/admin/causes
router.get('/causes', checkAdminAuth, async (req, res) => {
    try {
        res.json(await getCauses());
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors du chargement.' });
    }
});

// POST /api/admin/causes
router.post('/causes', checkAdminAuth, async (req, res) => {
    const { title, excerpt, image } = req.body;
    if (!title || !excerpt) {
        return res.status(400).json({ error: 'Le titre et la description sont requis.' });
    }
    try {
        const causes = await getCauses();
        const nextId = causes.length > 0 ? Math.max(...causes.map(c => c.id)) + 1 : 1;
        await saveCause(nextId, { title, excerpt, image: image || 'images/trauma_healing.jpg' });
        res.status(201).json({ success: true, message: 'Objectif ajouté avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde.' });
    }
});

// PUT /api/admin/causes/:id
router.put('/causes/:id', checkAdminAuth, async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, image } = req.body;
    if (!title || !excerpt) {
        return res.status(400).json({ error: 'Le titre et la description sont requis.' });
    }
    try {
        await saveCause(id, { title, excerpt, image: image || 'images/trauma_healing.jpg' });
        res.json({ success: true, message: 'Objectif mis à jour avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde.' });
    }
});

// DELETE /api/admin/causes/:id
router.delete('/causes/:id', checkAdminAuth, async (req, res) => {
    try {
        await deleteCause(req.params.id);
        res.json({ success: true, message: 'Objectif supprimé avec succès.' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
});

// ─── CMS Site Content ─────────────────────────────────────────────────────────

const SITE_CONTENT_PATH = path.join(__dirname, '..', '..', 'data', 'site_content.json');

// PUT /api/admin/site-content
router.put('/site-content', checkAdminAuth, async (req, res) => {
    try {
        await fs.writeFile(SITE_CONTENT_PATH, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true, message: 'Configuration du site mise à jour avec succès.' });
    } catch (err) {
        console.error('Erreur sauvegarde site-content :', err.message);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde du contenu du site.' });
    }
});

// ─── Upload d'image ───────────────────────────────────────────────────────────

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo

// POST /api/admin/upload
router.post('/upload', checkAdminAuth, async (req, res) => {
    try {
        const { filename, base64Data } = req.body;
        if (!filename || !base64Data) {
            return res.status(400).json({ error: 'Nom de fichier et données requis.' });
        }

        // Vérifier le type MIME déclaré
        const mimeMatch = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!mimeMatch || !ALLOWED_MIME.includes(mimeMatch[1])) {
            return res.status(400).json({ error: 'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WebP, GIF, SVG.' });
        }

        const buffer = Buffer.from(mimeMatch[2], 'base64');

        // Vérifier la taille
        if (buffer.length > MAX_SIZE_BYTES) {
            return res.status(400).json({ error: 'Fichier trop volumineux. Maximum : 5 Mo.' });
        }

        // Nom de fichier sécurisé (éviter directory traversal)
        const safeName   = path.basename(filename).replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const targetPath = path.join(__dirname, '..', '..', 'public', 'images', safeName);

        await fs.writeFile(targetPath, buffer);
        res.json({ success: true, url: `images/${safeName}` });
    } catch (err) {
        console.error('Erreur upload :', err.message);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde du fichier.' });
    }
});

module.exports = router;
