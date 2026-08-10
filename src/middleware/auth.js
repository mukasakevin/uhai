/**
 * auth.js — Middleware d'authentification pour les routes admin.
 * Le token Bearer doit correspondre à ADMIN_PASSWORD dans .env.
 *
 * ⚠️ ATTENTION : Cette implémentation est simple et suffit pour un usage interne.
 *    Pour un déploiement public, migrer vers JWT (jsonwebtoken) avec expiration.
 */

function checkAdminAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const adminPass  = process.env.ADMIN_PASSWORD || 'admin123';

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token === adminPass) return next();
    }

    return res.status(401).json({ error: 'Non autorisé. Veuillez vous connecter.' });
}

module.exports = { checkAdminAuth };
