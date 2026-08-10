/**
 * init-db.js — Initialisation de la base de données SQLite.
 * À exécuter une seule fois : node init-db.js
 *
 * Comportement :
 *   1. Crée le répertoire data/ si absent
 *   2. Crée la table "causes" si elle n'existe pas
 *   3. Peuple les données depuis causes.json (si présent) ou depuis seed.js
 */

require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const fs      = require('fs');

// Source unique des données initiales
const CAUSES  = require('./src/data/seed');

const dbPath  = path.resolve(__dirname, process.env.DB_PATH || 'data/uhai.db');
const dataDir = path.dirname(dbPath);

// Créer le répertoire data/ si absent
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Répertoire data/ créé.');
}

const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error('Erreur ouverture DB :', err.message);
        process.exit(1);
    }
    console.log('Connecté à SQLite :', dbPath);
});

db.serialize(() => {
    // Créer la table si elle n'existe pas
    db.run(`
        CREATE TABLE IF NOT EXISTS causes (
            id      INTEGER PRIMARY KEY,
            title   TEXT NOT NULL,
            excerpt TEXT NOT NULL,
            image   TEXT
        )
    `, err => {
        if (err) {
            console.error('Erreur création table :', err.message);
            db.close();
            process.exit(1);
        }
        console.log('Table "causes" vérifiée.');
        populateData();
    });
});

function populateData() {
    // Priorité : causes.json si disponible (données admin potentiellement modifiées)
    const jsonPath = path.join(__dirname, 'data', 'causes.json');
    let causes = CAUSES;

    if (fs.existsSync(jsonPath)) {
        try {
            causes = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            console.log('Données chargées depuis causes.json.');
        } catch {
            console.warn('causes.json invalide — utilisation des données seed.');
        }
    } else {
        console.log('Utilisation des données seed (src/data/seed.js).');
    }

    db.get('SELECT COUNT(*) as count FROM causes', (err, row) => {
        if (err) {
            console.error('Erreur vérification des enregistrements :', err.message);
            db.close();
            return;
        }

        if (row.count === 0) {
            console.log('Table vide — peuplement initial...');
            const stmt = db.prepare('INSERT OR REPLACE INTO causes (id, title, excerpt, image) VALUES (?, ?, ?, ?)');
            causes.forEach(c => stmt.run(c.id, c.title, c.excerpt, c.image));
            stmt.finalize(err => {
                if (err) console.error('Erreur finalisation :', err.message);
                else     console.log(`✅ ${causes.length} causes insérées.`);
                db.close();
            });
        } else {
            console.log(`Table déjà peuplée (${row.count} enregistrements). Aucune action.`);
            db.close();
        }
    });
}
