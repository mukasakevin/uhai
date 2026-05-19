const express = require('express');
const path = require('path');

const app = express();

// ✅ Render / local compatible
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes
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

// 404 fallback
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server (Render compatible)
app.listen(PORT, () => {
    console.log(`Serveur Centre Uhai en cours d'exécution sur port ${PORT}`);
});