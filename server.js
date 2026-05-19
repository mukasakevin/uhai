const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 65001;

// Servir les fichiers statiques depuis le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Routes pour les pages du site HRL Centre Uhai
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/approach', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'approach.html'));
});

app.get('/actions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'actions.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Gestion des erreurs 404 (redirige vers l'accueil)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur Centre Uhai en cours d'exécution sur http://localhost:${PORT}`);
});
