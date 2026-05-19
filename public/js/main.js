document.addEventListener('DOMContentLoaded', () => {
    // 1. Gestion du Header au scroll (Auto-hide)
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        // Opacité (scrolled)
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Apparition / Disparition dynamique
        if (window.scrollY > lastScrollY && window.scrollY > 150) {
            // Scroll vers le bas -> Cacher le header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut -> Montrer le header
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = window.scrollY;
    });

    // 2. Menu Burger Mobile
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

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

    // 3. Gestion de la Modale de Don
    const modal = document.getElementById('donation-modal');
    const donateButtons = document.querySelectorAll('.donate-btn');
    const closeModal = document.querySelector('.modal-close');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');

    if (modal) {
        donateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Sélection du montant de don
        amountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                amountButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (customAmountInput) customAmountInput.value = '';
            });
        });

        if (customAmountInput) {
            customAmountInput.addEventListener('input', () => {
                amountButtons.forEach(b => b.classList.remove('active'));
            });
        }
    }

    // 4. Filtrage dynamique des projets (Page Projets)
    const filterTabs = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterTabs.length > 0 && projectCards.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Gestion de la classe active
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const filter = tab.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // 5. Accordéon FAQ (Page Contact)
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Fermer tous les autres
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBody = otherItem.querySelector('.faq-body');
                    if (otherBody) otherBody.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    const body = item.querySelector('.faq-body');
                    if (body) body.style.maxHeight = body.scrollHeight + "px";
                }
            });
        });
    }

    // 6. Animation des chiffres clés (Compteurs)
    const impactNumbers = document.querySelectorAll('.impact-number');
    let animated = false;

    const animateNumbers = () => {
        impactNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    number.textContent = target + (number.getAttribute('data-suffix') || '');
                } else {
                    number.textContent = Math.ceil(current) + (number.getAttribute('data-suffix') || '');
                }
            }, 30);
        });
    };

    const checkScroll = () => {
        const impactSection = document.querySelector('.impact-section');
        if (impactSection && !animated) {
            const rect = impactSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                animateNumbers();
                animated = true;
                window.removeEventListener('scroll', checkScroll);
            }
        }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Vérifier au chargement

    // 5. Slider Hero (Diaporama)
    const heroSlides = document.querySelectorAll('.hero-bg-slide');
    if (heroSlides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            heroSlides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % heroSlides.length;
            heroSlides[currentSlide].classList.add('active');
        }, 5000); // Change d'image toutes les 5 secondes
    }
});
