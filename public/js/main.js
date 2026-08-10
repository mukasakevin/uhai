/**
 * main.js — Logique spécifique aux pages.
 * Charge en dernier, après cms.js et ui.js.
 *
 * Responsabilités :
 *   - Appeler le CMS au chargement (défini dans cms.js)
 *   - Filtrage des projets (page /projects)
 *   - Accordéon FAQ (page /contact)
 *   - Chargement dynamique des objectifs/causes (page /actions)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Charger le CMS (défini dans cms.js) ───────────────────────────────
    if (typeof window.loadDynamicCMS === 'function') {
        window.loadDynamicCMS();
    }

    // ── Filtrage des projets (page /projects) ─────────────────────────────
    const filterTabs   = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length && projectCards.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const match = filter === 'all' || card.getAttribute('data-category') === filter;
                    if (match) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
    }

    // ── Accordéon FAQ (page /contact) ─────────────────────────────────────
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            item.querySelector('.faq-header')?.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Fermer tous
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const body = other.querySelector('.faq-body');
                    if (body) body.style.maxHeight = null;
                });
                // Ouvrir celui cliqué si pas actif
                if (!isActive) {
                    item.classList.add('active');
                    const body = item.querySelector('.faq-body');
                    if (body) body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });
    }

    // ── Chargement dynamique des objectifs depuis l'API (page /actions) ───
    const objectivesGrid = document.getElementById('objectives-grid');
    if (objectivesGrid) {
        const iconMap = {
            trauma: 'fas fa-heartbeat',      conflit: 'fas fa-dove',
            transformation: 'fas fa-dove',   genre: 'fas fa-female',
            femme: 'fas fa-female',           vbg: 'fas fa-female',
            reproduction: 'fas fa-user-friends', santé: 'fas fa-user-friends',
            alimentaire: 'fas fa-seedling',   sécurité: 'fas fa-seedling',
            environnement: 'fas fa-tree',     enfance: 'fas fa-child',
            enfant: 'fas fa-child',           protection: 'fas fa-child',
        };
        const idIconMap = [null,'fas fa-heartbeat','fas fa-dove','fas fa-female','fas fa-user-friends','fas fa-seedling','fas fa-tree','fas fa-child'];

        function getIcon(title, id) {
            const t = title.toLowerCase();
            for (const [key, icon] of Object.entries(iconMap)) {
                if (t.includes(key)) return icon;
            }
            return idIconMap[id] || 'fas fa-check-circle';
        }

        const imageMap = {
            trauma: 'images/trauma_healing.jpg',      conflit: 'images/conflict_resolution.jpg',
            transformation: 'images/conflict_resolution.jpg', genre: 'images/gender_violence_fight.png',
            femme: 'images/gender_violence_fight.png', vbg: 'images/gender_violence_fight.png',
            reproduction: 'images/reproductive_health.png',   alimentaire: 'images/food_security.jpg',
            sécurité: 'images/food_security.jpg',     environnement: 'images/environment.png',
            enfance: 'images/child_protection.jpg',   enfant: 'images/child_protection.jpg',
        };

        function getImage(title, dbImage) {
            const t = title.toLowerCase();
            for (const [key, img] of Object.entries(imageMap)) {
                if (t.includes(key)) return img;
            }
            return dbImage && !dbImage.startsWith('causes/') ? dbImage : 'images/trauma_healing.jpg';
        }

        fetch('/api/causes')
            .then(res => res.json())
            .then(causes => {
                if (!causes?.length) return;
                objectivesGrid.innerHTML = causes.map((cause, i) => {
                    const cleanDesc = (cause.excerpt || cause.detail || '').replace(/<[^>]*>/g, '');
                    return `
                    <div class="objective-card">
                        <div class="objective-img">
                            <img src="${getImage(cause.title, cause.image)}" alt="${cause.title}">
                        </div>
                        <div class="objective-content">
                            <div class="objective-icon"><i class="${getIcon(cause.title, cause.id || i + 1)}"></i></div>
                            <h3 class="objective-title">${cause.title}</h3>
                            <p class="objective-desc">${cleanDesc}</p>
                        </div>
                    </div>`;
                }).join('');
            })
            .catch(err => console.error('Erreur chargement objectifs :', err));
    }

});
