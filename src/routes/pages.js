/**
 * pages.js — Routes de rendu des pages HTML.
 * Chaque route sert le fichier HTML statique correspondant.
 * Le fallback 404 redirige vers l'accueil.
 */

const express = require('express');
const path    = require('path');

const router   = express.Router();
const HTML_DIR = path.join(__dirname, '..', '..', 'public');

const pages = {
    '/'        : 'index.html',
    '/about'   : 'about.html',
    '/approach': 'approach.html',
    '/actions' : 'actions.html',
    '/projects': 'projects.html',
    '/contact' : 'contact.html',
    '/admin'   : 'admin.html',
};

// Enregistrer chaque route HTML dynamiquement
Object.entries(pages).forEach(([route, file]) => {
    router.get(route, (req, res) => {
        res.sendFile(path.join(HTML_DIR, file));
    });
});

module.exports = router;
