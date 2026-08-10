/**
 * cms.js — Chargement dynamique du contenu CMS depuis /api/site-content.
 * Doit être chargé AVANT main.js.
 * Expose la fonction globale : window.loadDynamicCMS()
 */

window.loadDynamicCMS = function () {
    fetch('/api/site-content')
        .then(res => res.json())
        .then(content => {

            // ── Logo ────────────────────────────────────────────────────────
            if (content.general?.logo) {
                document.querySelectorAll('.logo img').forEach(img => {
                    img.src = content.general.logo;
                });
            }

            // ── Contact (footer) ─────────────────────────────────────────────
            const emailEl = document.querySelector('.contact-email');
            const phoneEl = document.querySelector('.contact-phone');
            if (emailEl && content.general?.email) emailEl.textContent = content.general.email;
            if (phoneEl && content.general?.phone) phoneEl.textContent = content.general.phone;

            // ── Description footer ───────────────────────────────────────────
            const footerP = document.querySelector('.footer-about p');
            if (footerP && content.general?.siteName) {
                footerP.textContent = `${content.general.siteName} — HRL. Une organisation non gouvernementale œuvrant en RDC pour la guérison du traumatisme, la consolidation de la paix et la cohésion sociale.`;
            }

            // ── Page d'accueil uniquement ─────────────────────────────────────
            if (window.location.pathname === '/') {
                // Hero slider
                const heroSlider = document.querySelector('.hero-slider');
                if (heroSlider && content.home?.hero?.slides) {
                    heroSlider.innerHTML = content.home.hero.slides.map((slide, i) => `
                        <div class="hero-bg-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${slide.image}');"></div>
                    `).join('');
                }

                // Hero slider uniquement (images)
                const heroSlider = document.querySelector('.hero-slider');
                if (heroSlider && content.home?.hero?.slides) {
                    heroSlider.innerHTML = content.home.hero.slides.map((slide, i) => `
                        <div class="hero-bg-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${slide.image}');"></div>
                    `).join('');
                }
                // NOTE : titre et description hero restent statiques dans le HTML.

                // Mission : le titre et textes restent statiques dans le HTML.

                // Piliers
                const pillarsGrid = document.querySelector('.pillars-grid');
                if (pillarsGrid && content.home?.pillars) {
                    pillarsGrid.innerHTML = content.home.pillars.map(p => `
                        <div class="pillar-card">
                            <div class="pillar-icon"><i class="${p.icon}"></i></div>
                            <h3 class="pillar-title">${p.title}</h3>
                            <p class="pillar-desc">${p.desc}</p>
                        </div>
                    `).join('');
                }

                // Chiffres clés
                const impactGrid = document.querySelector('.impact-grid');
                if (impactGrid && content.home?.stats) {
                    impactGrid.innerHTML = content.home.stats.map(stat => `
                        <div class="impact-card">
                            <div class="impact-number" data-target="${stat.target}" data-suffix="${stat.suffix}">${stat.target}${stat.suffix}</div>
                            <div class="impact-label">${stat.label}</div>
                        </div>
                    `).join('');
                    // Relancer l'animation des compteurs après injection
                    if (typeof window.animateNumbers === 'function') window.animateNumbers();
                }
            }

            // ── Page À propos ────────────────────────────────────────────────
            if (window.location.pathname === '/about' && content.about) {
                const t = document.querySelector('.section-title');
                const s = document.querySelector('.section-subtitle');
                if (t) t.textContent = content.about.title;
                if (s) s.textContent = content.about.subtitle;
            }

            // ── Page Projets : cartes dynamiques ─────────────────────────────
            const projectsGrid = document.querySelector('.projects-grid');
            if (projectsGrid && content.projects) {
                // Mapping catégorie → label affiché
                const categoryLabel = {
                    peace: 'Sociothérapie',
                    protection: 'Protection',
                    economy: 'Économie',
                };
                // Mapping catégorie/index → image dédiée
                const projectImages = [
                    'images/trauma_healing.jpg',
                    'images/conflict_resolution.jpg',
                    'images/gender_violence_fight.png',
                ];

                projectsGrid.innerHTML = content.projects.map((proj, i) => `
                    <div class="project-card" data-category="${proj.category || 'all'}">
                        <div class="project-img">
                            <span class="project-category">${categoryLabel[proj.category] || proj.category}</span>
                            <img src="${proj.image || projectImages[i % projectImages.length]}" alt="${proj.title}">
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${proj.title}</h3>
                            <p class="project-desc">${proj.description}</p>
                            <div class="project-footer">
                                <span style="font-family:'Outfit';font-weight:700;color:var(--accent);">Reçu fiscal disponible</span>
                                <button class="btn btn-primary donate-btn" style="padding:0.6rem 1.5rem;font-size:0.95rem;">Soutenir ce projet</button>
                            </div>
                        </div>
                    </div>
                `).join('');
            }

        })
        .catch(err => console.error('Erreur CMS :', err));
};
