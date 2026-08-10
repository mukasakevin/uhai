/**
 * ui.js — Composants UI partagés sur toutes les pages.
 * Doit être chargé AVANT main.js.
 * Gère : header scroll, menu burger, modal de don, compteurs, hero slider, recherche.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Header : effet verre au scroll (toujours visible) ─────────────────
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else                     header.classList.remove('scrolled');
        });
    }

    // ── 2. Menu burger mobile ──────────────────────────────────────────────
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks   = document.querySelector('.nav-links');
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = burgerMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // ── 3. Modal de don ────────────────────────────────────────────────────
    const modal       = document.getElementById('donation-modal');
    const closeModal  = document.querySelector('.modal-close');
    const amountBtns  = document.querySelectorAll('.amount-btn');
    const customInput = document.getElementById('custom-amount');

    if (modal) {
        // Ouvrir le modal sur tous les boutons .donate-btn
        document.addEventListener('click', e => {
            if (e.target.closest('.donate-btn')) {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        const closeModalFn = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeModal) closeModal.addEventListener('click', closeModalFn);
        modal.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });

        // Sélection du montant prédéfini
        amountBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (customInput) customInput.value = '';
            });
        });

        if (customInput) {
            customInput.addEventListener('input', () => {
                amountBtns.forEach(b => b.classList.remove('active'));
            });
        }
    }

    // ── 4. Animation des chiffres clés (compteurs) ────────────────────────
    const impactNumbers = document.querySelectorAll('.impact-number');
    let animated = false;

    window.animateNumbers = () => {
        impactNumbers.forEach(el => {
            const target    = parseInt(el.getAttribute('data-target'));
            const suffix    = el.getAttribute('data-suffix') || '';
            let current     = 0;
            const increment = target / 50;
            const timer     = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    el.textContent = target + suffix;
                } else {
                    el.textContent = Math.ceil(current) + suffix;
                }
            }, 30);
        });
    };

    const checkScrollForNumbers = () => {
        const section = document.querySelector('.impact-section');
        if (section && !animated) {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                window.animateNumbers();
                animated = true;
                window.removeEventListener('scroll', checkScrollForNumbers);
            }
        }
    };
    window.addEventListener('scroll', checkScrollForNumbers);
    checkScrollForNumbers();

    // ── 5. Hero Slider (diaporama automatique) ────────────────────────────
    const heroSlides = document.querySelectorAll('.hero-bg-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000);
    }

    // ── 6. Recherche globale (overlay Ctrl+K) ────────────────────────────
    const SITE_PAGES = [
        { url: '/',         title: 'Accueil',            description: 'Découvrez le Centre UHAI — Guérir, Reconstruire et Vivre en RDC.',                          keywords: 'accueil home guérir reconstruire vivre uhai hrl rdcongo sociothérapie traumatisme paix',    icon: 'fas fa-home',              iconClass: '' },
        { url: '/about',    title: 'Qui sommes-nous',    description: 'Histoire, mission, valeurs et zone d\'action du Centre UHAI.',                              keywords: 'about qui sommes nous histoire mission valeurs dignité neutralité inclusion nord-kivu',      icon: 'fas fa-users',             iconClass: '' },
        { url: '/approach', title: 'Notre Approche HRL', description: 'Healing, Rebuilding and Living — sociothérapie communautaire en 5 étapes.',                  keywords: 'approche hrl healing rebuilding living sociothérapie sécurité deuil reconnexion plaidoyer', icon: 'fas fa-heartbeat',         iconClass: 'warm' },
        { url: '/actions',  title: 'Nos Actions',        description: '7 objectifs : traumatisme, conflits, VBG, santé, environnement, enfance.',                   keywords: 'actions objectifs traumatisme conflits violences genre vbg alimentaire environnement',       icon: 'fas fa-hand-holding-heart', iconClass: 'logo' },
        { url: '/projects', title: 'Projets & Impact',   description: 'Nos projets sur le terrain et leur impact dans les communautés.',                            keywords: 'projets impact résultats terrain communautés bénéficiaires financement soutien',            icon: 'fas fa-seedling',          iconClass: '' },
        { url: '/contact',  title: 'Contact',            description: 'Contactez le Centre UHAI — partenariat, formation HRL, bénévolat, don.',                    keywords: 'contact partenariat formation bénévolat don email téléphone hrlcentreuhai.org',             icon: 'fas fa-envelope',          iconClass: 'warm' },
    ];

    // Injecter l'overlay de recherche dans le DOM
    document.body.insertAdjacentHTML('beforeend', `
    <div class="search-overlay" id="search-overlay" role="dialog" aria-modal="true" aria-label="Recherche">
        <button class="search-overlay-close" id="search-overlay-close" aria-label="Fermer la recherche"><i class="fas fa-times"></i></button>
        <div class="search-overlay-inner">
            <span class="search-overlay-label"><i class="fas fa-search"></i>&nbsp; Rechercher sur le site</span>
            <div class="search-input-wrapper">
                <span class="search-input-icon"><i class="fas fa-search"></i></span>
                <input type="text" id="search-input" class="search-input" placeholder="Rechercher une page, un thème…" autocomplete="off" spellcheck="false" aria-label="Champ de recherche"/>
                <button class="search-input-clear" id="search-input-clear" aria-label="Effacer"><i class="fas fa-times-circle"></i></button>
            </div>
            <div class="search-results" id="search-results" role="listbox"></div>
            <div class="search-kbd-hint"><kbd>↑</kbd><kbd>↓</kbd> naviguer &nbsp;·&nbsp; <kbd>Entrée</kbd> ouvrir &nbsp;·&nbsp; <kbd>Échap</kbd> fermer &nbsp;·&nbsp; <kbd>Ctrl</kbd>+<kbd>K</kbd> ouvrir</div>
        </div>
    </div>`);

    // Injecter le bouton de recherche dans la navbar
    document.querySelectorAll('.nav-links').forEach(nav => {
        const donateBtn = nav.querySelector('.donate-btn');
        const btn = document.createElement('button');
        btn.className = 'search-btn';
        btn.id = 'search-trigger';
        btn.setAttribute('aria-label', 'Ouvrir la recherche');
        btn.innerHTML = '<i class="fas fa-search"></i>';
        donateBtn ? nav.insertBefore(btn, donateBtn) : nav.appendChild(btn);
    });

    const overlay      = document.getElementById('search-overlay');
    const searchInput  = document.getElementById('search-input');
    const clearBtn     = document.getElementById('search-input-clear');
    const results      = document.getElementById('search-results');
    const closeSearch  = document.getElementById('search-overlay-close');
    let focusedIndex   = -1;

    function highlight(text, q) {
        if (!q.trim()) return text;
        return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
    }

    function openSearch() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 100);
        renderResults('');
    }

    function closeSearchFn() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        focusedIndex = -1;
    }

    function renderResults(query) {
        const q = query.toLowerCase().trim();
        focusedIndex = -1;
        const filtered = q
            ? SITE_PAGES.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.keywords.includes(q))
            : SITE_PAGES;

        if (!filtered.length) {
            results.innerHTML = `<div class="search-no-results"><i class="fas fa-search-minus"></i><p>Aucun résultat pour « ${query} »</p></div>`;
            return;
        }

        const titleEl = q
            ? `<div class="search-results-title">${filtered.length} résultat${filtered.length > 1 ? 's' : ''}</div>`
            : `<div class="search-results-title">Pages du site</div>`;

        results.innerHTML = titleEl + filtered.map((p, i) => `
            <a href="${p.url}" class="search-result-item" role="option" data-index="${i}">
                <div class="search-result-icon ${p.iconClass}"><i class="${p.icon}"></i></div>
                <div class="search-result-body">
                    <div class="search-result-name">${highlight(p.title, query)}</div>
                    <div class="search-result-desc">${highlight(p.description, query)}</div>
                </div>
                <i class="fas fa-arrow-right search-result-arrow"></i>
            </a>`).join('');

        results.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.style.animationDelay = `${i * 0.05}s`;
        });
    }

    function moveFocus(dir) {
        const items = results.querySelectorAll('.search-result-item');
        if (!items.length) return;
        items.forEach(i => i.classList.remove('focused'));
        focusedIndex = (focusedIndex + dir + items.length) % items.length;
        items[focusedIndex].classList.add('focused');
        items[focusedIndex].scrollIntoView({ block: 'nearest' });
    }

    document.querySelectorAll('#search-trigger, .search-btn').forEach(btn => btn.addEventListener('click', openSearch));
    closeSearch.addEventListener('click', closeSearchFn);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearchFn(); });
    searchInput.addEventListener('input', () => {
        clearBtn.classList.toggle('visible', searchInput.value.length > 0);
        renderResults(searchInput.value);
    });
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        searchInput.focus();
        renderResults('');
    });
    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('active') ? closeSearchFn() : openSearch();
            return;
        }
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape')    { closeSearchFn(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); return; }
        if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); return; }
        if (e.key === 'Enter') {
            const focused = results.querySelector('.search-result-item.focused');
            if (focused) { closeSearchFn(); window.location.href = focused.getAttribute('href'); }
        }
    });

    // ── 7. Contrôle de la Vidéo d'arrière-plan & Modale Lightbox ──────────
    const bgVideo = document.getElementById('hero-bg-video');
    const bgVideoContainer = document.querySelector('.hero-video-bg');
    if (bgVideo && bgVideoContainer) {
        // Rendre visible le conteneur de la vidéo seulement lorsqu'elle commence à jouer
        bgVideo.addEventListener('playing', () => {
            bgVideoContainer.classList.add('loaded');
        });

        // Limiter la lecture en arrière-plan aux 30 premières secondes (boucle)
        bgVideo.addEventListener('timeupdate', () => {
            if (bgVideo.currentTime >= 30) {
                bgVideo.currentTime = 0;
                bgVideo.play().catch(err => console.log('Échec de la lecture de la vidéo de fond:', err));
            }
        });
    }

});
