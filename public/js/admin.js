// Gestion du CMS d'administration style Shopify - Centre Uhai

let adminToken = localStorage.getItem('uhai_admin_token') || null;
let siteContent = null;

document.addEventListener('DOMContentLoaded', () => {
    initView();
});

function initView() {
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');

    if (adminToken) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'flex';
        loadCMSContent();
        fetchCauses();
    } else {
        loginView.style.display = 'flex';
        dashboardView.style.display = 'none';
    }
}

// 1. Navigation entre les onglets
function switchTab(tabId) {
    document.querySelectorAll('.cms-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    const activeItem = document.querySelector(`.sidebar-item[data-tab="${tabId}"]`);
    if (activeItem) activeItem.classList.add('active');
}

// 2. Authentification
async function handleLogin(event) {
    event.preventDefault();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            adminToken = data.token;
            localStorage.setItem('uhai_admin_token', adminToken);
            showToast('Connexion au CMS réussie', 'success');
            initView();
        } else {
            showToast(data.error || 'Mot de passe incorrect', 'error');
        }
    } catch (err) {
        showToast('Erreur serveur lors de la connexion', 'error');
    }
}

function handleLogout() {
    adminToken = null;
    localStorage.removeItem('uhai_admin_token');
    showToast('Déconnexion réussie', 'success');
    initView();
}

// 3. Charger le contenu global du site
async function loadCMSContent() {
    try {
        const response = await fetch('/api/site-content');
        if (!response.ok) throw new Error('Impossible de charger le contenu');
        
        siteContent = await response.json();
        populateForms(siteContent);
    } catch (err) {
        showToast('Erreur de chargement du contenu global', 'error');
    }
}

// Remplir les formulaires avec les données reçues
function populateForms(content) {
    // Général
    document.getElementById('gen-name').value = content.general.siteName || '';
    document.getElementById('gen-email').value = content.general.email || '';
    document.getElementById('gen-phone').value = content.general.phone || '';
    document.getElementById('gen-address').value = content.general.address || '';
    document.getElementById('gen-logo').value = content.general.logo || '';

    // Accueil Hero & Mission
    if (content.home) {
        const firstSlide = content.home.hero.slides[0] || {};
        document.getElementById('hero-title-input').value = firstSlide.title || '';
        document.getElementById('hero-desc-input').value = firstSlide.description || '';
        document.getElementById('hero-img-input').value = firstSlide.image || '';

        document.getElementById('mission-title-input').value = content.home.mission.title || '';
        document.getElementById('mission-p1-input').value = content.home.mission.p1 || '';
        document.getElementById('mission-p2-input').value = content.home.mission.p2 || '';

        // Chiffres clés (Stats)
        const statsGrid = document.getElementById('stats-inputs-grid');
        statsGrid.innerHTML = content.home.stats.map((stat, idx) => `
            <div class="form-group" style="border: 1px solid var(--glass-border); padding: 1rem; border-radius: 0.5rem;">
                <label style="color: var(--accent);">Compteur ${idx + 1}</label>
                <div style="margin-bottom: 0.75rem;">
                    <label>Valeur cible</label>
                    <input type="text" id="stat-target-${idx}" class="form-control" value="${stat.target}">
                </div>
                <div style="margin-bottom: 0.75rem;">
                    <label>Suffixe (ex: +)</label>
                    <input type="text" id="stat-suffix-${idx}" class="form-control" value="${stat.suffix}">
                </div>
                <div>
                    <label>Label explicatif</label>
                    <input type="text" id="stat-label-${idx}" class="form-control" value="${stat.label}">
                </div>
            </div>
        `).join('');
    }

    // À Propos
    if (content.about) {
        document.getElementById('about-title-input').value = content.about.title || '';
        document.getElementById('about-subtitle-input').value = content.about.subtitle || '';
        document.getElementById('about-history-input').value = content.about.history || '';
    }

    // Projets & FAQ
    const projectsGrid = document.getElementById('projects-inputs-grid');
    if (content.projects) {
        projectsGrid.innerHTML = content.projects.map((proj, idx) => `
            <div style="border: 1px solid var(--glass-border); padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <div class="form-group">
                    <label>Projet ${idx + 1} &mdash; Titre</label>
                    <input type="text" id="proj-title-${idx}" class="form-control" value="${proj.title}">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="proj-desc-${idx}" class="form-control" rows="2">${proj.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Catégorie</label>
                        <select id="proj-cat-${idx}" class="form-control">
                            <option value="peace" ${proj.category === 'peace' ? 'selected' : ''}>Sociothérapie</option>
                            <option value="protection" ${proj.category === 'protection' ? 'selected' : ''}>Protection</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Avancement financement (%)</label>
                        <input type="number" id="proj-progress-${idx}" class="form-control" min="0" max="100" value="${proj.progress}">
                    </div>
                </div>
            </div>
        `).join('');
    }

    const faqGrid = document.getElementById('faq-inputs-grid');
    if (content.faq) {
        faqGrid.innerHTML = content.faq.map((item, idx) => `
            <div style="border: 1px solid var(--glass-border); padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                <div class="form-group">
                    <label>Question ${idx + 1}</label>
                    <input type="text" id="faq-q-${idx}" class="form-control" value="${item.question}">
                </div>
                <div class="form-group">
                    <label>Réponse</label>
                    <textarea id="faq-a-${idx}" class="form-control" rows="3">${item.answer}</textarea>
                </div>
            </div>
        `).join('');
    }
}

// 4. Enregistrer la configuration globale du site
async function saveGlobalContent() {
    if (!siteContent) return;

    // Récupérer les valeurs des formulaires
    siteContent.general.siteName = document.getElementById('gen-name').value;
    siteContent.general.email = document.getElementById('gen-email').value;
    siteContent.general.phone = document.getElementById('gen-phone').value;
    siteContent.general.address = document.getElementById('gen-address').value;
    siteContent.general.logo = document.getElementById('gen-logo').value;

    // Home slides
    const firstSlide = siteContent.home.hero.slides[0] || {};
    firstSlide.title = document.getElementById('hero-title-input').value;
    firstSlide.description = document.getElementById('hero-desc-input').value;
    firstSlide.image = document.getElementById('hero-img-input').value;
    siteContent.home.hero.slides[0] = firstSlide;

    siteContent.home.mission.title = document.getElementById('mission-title-input').value;
    siteContent.home.mission.p1 = document.getElementById('mission-p1-input').value;
    siteContent.home.mission.p2 = document.getElementById('mission-p2-input').value;

    // Stats
    siteContent.home.stats = siteContent.home.stats.map((stat, idx) => ({
        target: document.getElementById(`stat-target-${idx}`).value,
        suffix: document.getElementById(`stat-suffix-${idx}`).value,
        label: document.getElementById(`stat-label-${idx}`).value
    }));

    // About
    siteContent.about.title = document.getElementById('about-title-input').value;
    siteContent.about.subtitle = document.getElementById('about-subtitle-input').value;
    siteContent.about.history = document.getElementById('about-history-input').value;

    // Projets & FAQ
    siteContent.projects = siteContent.projects.map((proj, idx) => ({
        id: proj.id,
        title: document.getElementById(`proj-title-${idx}`).value,
        description: document.getElementById(`proj-desc-${idx}`).value,
        category: document.getElementById(`proj-cat-${idx}`).value,
        progress: parseInt(document.getElementById(`proj-progress-${idx}`).value)
    }));

    siteContent.faq = siteContent.faq.map((item, idx) => ({
        question: document.getElementById(`faq-q-${idx}`).value,
        answer: document.getElementById(`faq-a-${idx}`).value
    }));

    try {
        const response = await fetch('/api/admin/site-content', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(siteContent)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Contenu du site mis à jour avec succès', 'success');
        } else {
            showToast(data.error || 'Erreur lors de la sauvegarde', 'error');
        }
    } catch (err) {
        showToast('Erreur réseau lors de l\'enregistrement', 'error');
    }
}

// 5. Récupération & Gestion des Objectifs (Causes)
async function fetchCauses() {
    try {
        const response = await fetch('/api/admin/causes', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        if (response.status === 401) {
            handleLogout();
            return;
        }

        const data = await response.json();
        renderCauses(data);
    } catch (err) {
        showToast('Impossible de charger la liste des causes', 'error');
    }
}

function renderCauses(causes) {
    const list = document.getElementById('causes-list');
    list.innerHTML = causes.map(cause => `
        <div class="cause-card-admin" id="cause-card-${cause.id}">
            <div class="cause-img-admin">
                <img src="${cause.image || 'images/trauma_healing.jpg'}" alt="${cause.title}">
            </div>
            <div class="cause-card-body">
                <h3 class="cause-card-title">${cause.title}</h3>
                <p class="cause-card-desc">${cause.excerpt || ''}</p>
                <div class="cause-card-actions">
                    <button class="btn-edit" onclick="openEditModal(${cause.id}, '${escapeHtml(cause.title)}', '${escapeHtml(cause.excerpt)}', '${cause.image}')">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                    <button class="btn-delete" onclick="handleDelete(${cause.id})" title="Supprimer">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Modales Causes
function openAddModal() {
    document.getElementById('modal-title').textContent = "Ajouter une Cause";
    document.getElementById('cause-id').value = "";
    document.getElementById('cause-title-input').value = "";
    document.getElementById('cause-excerpt-input').value = "";
    document.getElementById('cause-image-input').value = "";
    document.getElementById('cause-modal').classList.add('active');
}

function openEditModal(id, title, excerpt, image) {
    document.getElementById('modal-title').textContent = "Modifier la Cause";
    document.getElementById('cause-id').value = id;
    document.getElementById('cause-title-input').value = title;
    document.getElementById('cause-excerpt-input').value = excerpt;
    document.getElementById('cause-image-input').value = image || "";
    
    document.getElementById('cause-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('cause-modal').classList.remove('active');
}

// Formulaire Cause Submit
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('cause-id').value;
    const title = document.getElementById('cause-title-input').value;
    const excerpt = document.getElementById('cause-excerpt-input').value;
    const image = document.getElementById('cause-image-input').value;

    const payload = { title, excerpt, image };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/causes/${id}` : '/api/admin/causes';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Sauvegarde de la cause réussie', 'success');
            closeModal();
            fetchCauses();
        } else {
            showToast(data.error || 'Erreur de sauvegarde', 'error');
        }
    } catch (err) {
        showToast('Erreur réseau lors de la sauvegarde de la cause', 'error');
    }
}

async function handleDelete(id) {
    if (!confirm('Voulez-vous vraiment supprimer cet objectif spécifique ?')) return;

    try {
        const response = await fetch(`/api/admin/causes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message || 'Objectif supprimé', 'success');
            fetchCauses();
        } else {
            showToast(data.error || 'Erreur lors de la suppression', 'error');
        }
    } catch (err) {
        showToast('Erreur réseau lors de la suppression', 'error');
    }
}

// Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
    
    const icon = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Image Upload
async function handleImageUpload(event, targetInputId) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result;
        
        try {
            const response = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    filename: file.name,
                    base64Data: base64Data
                })
            });

            const data = await response.json();
            if (response.ok && data.url) {
                document.getElementById(targetInputId).value = data.url;
                showToast('Image téléchargée avec succès', 'success');
            } else {
                showToast(data.error || 'Erreur lors du téléchargement', 'error');
            }
        } catch (err) {
            showToast('Erreur réseau', 'error');
        }
    };
    reader.readAsDataURL(file);
}
