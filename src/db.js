/**
 * db.js — Connexion SQLite et helpers CRUD pour les causes.
 * Gère la logique : DB → JSON fallback → données seed en dernier recours.
 */

const sqlite3 = require('sqlite3').verbose();
const path    = require('path');
const fs      = require('fs').promises;
const CAUSES  = require('./data/seed');

// ─── Connexion ───────────────────────────────────────────────────────────────

let _db = null;

function getDb() {
    if (_db) return _db;
    const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || 'data/uhai.db');
    _db = new sqlite3.Database(dbPath, err => {
        if (err) console.error('Erreur connexion SQLite :', err.message);
        else     console.log('SQLite connecté :', dbPath);
    });
    return _db;
}

// ─── Helpers de requêtes ──────────────────────────────────────────────────────

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        if (!db) return reject(new Error('Pas de connexion DB'));
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        if (!db) return reject(new Error('Pas de connexion DB'));
        db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    });
}

function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        if (!db) return reject(new Error('Pas de connexion DB'));
        db.run(sql, params, function(err) { err ? reject(err) : resolve(this); });
    });
}

// ─── CRUD Causes ─────────────────────────────────────────────────────────────

const JSON_PATH = path.join(__dirname, '..', 'data', 'causes.json');

async function getCauses() {
    // 1. Essayer la base SQLite
    try {
        const rows = await dbAll('SELECT * FROM causes ORDER BY id ASC');
        if (rows && rows.length > 0) return rows;
    } catch (err) {
        console.error('DB inaccessible, bascule vers JSON :', err.message);
    }

    // 2. Essayer le fichier JSON
    try {
        const data = await fs.readFile(JSON_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('causes.json inaccessible, bascule vers seed :', err.message);
    }

    // 3. Données seed en dernier recours
    return CAUSES;
}

async function saveCause(id, causeData) {
    // Sauvegarder en DB
    let savedToDb = false;
    try {
        const existing = await dbGet('SELECT id FROM causes WHERE id = ?', [id]);
        if (existing) {
            await dbRun(
                'UPDATE causes SET title = ?, excerpt = ?, image = ? WHERE id = ?',
                [causeData.title, causeData.excerpt, causeData.image, id]
            );
        } else {
            await dbRun(
                'INSERT INTO causes (id, title, excerpt, image) VALUES (?, ?, ?, ?)',
                [id, causeData.title, causeData.excerpt, causeData.image]
            );
        }
        savedToDb = true;
    } catch (err) {
        console.error('Erreur sauvegarde DB :', err.message);
    }

    // Toujours synchroniser le JSON comme backup
    try {
        let causes = [];
        try {
            const raw = await fs.readFile(JSON_PATH, 'utf8');
            causes = JSON.parse(raw);
        } catch {
            causes = [...CAUSES];
        }
        const idx = causes.findIndex(c => c.id === parseInt(id));
        if (idx !== -1) causes[idx] = { ...causes[idx], ...causeData, id: parseInt(id) };
        else            causes.push({ ...causeData, id: parseInt(id) });
        await fs.writeFile(JSON_PATH, JSON.stringify(causes, null, 2), 'utf8');
    } catch (err) {
        console.error('Erreur sync JSON :', err.message);
        if (!savedToDb) throw err;
    }
}

async function deleteCause(id) {
    let deletedFromDb = false;
    try {
        await dbRun('DELETE FROM causes WHERE id = ?', [id]);
        deletedFromDb = true;
    } catch (err) {
        console.error('Erreur suppression DB :', err.message);
    }

    try {
        let causes = [];
        try {
            const raw = await fs.readFile(JSON_PATH, 'utf8');
            causes = JSON.parse(raw);
        } catch {
            causes = [...CAUSES];
        }
        causes = causes.filter(c => c.id !== parseInt(id));
        await fs.writeFile(JSON_PATH, JSON.stringify(causes, null, 2), 'utf8');
    } catch (err) {
        console.error('Erreur suppression JSON :', err.message);
        if (!deletedFromDb) throw err;
    }
}

module.exports = { getCauses, saveCause, deleteCause };
