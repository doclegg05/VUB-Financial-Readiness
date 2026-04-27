document.addEventListener('DOMContentLoaded', () => {

    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        updateThemeIcon('dark');
    }

    themeToggleBtn.addEventListener('click', toggleTheme);

    function toggleTheme() {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        }
    }

    function currentTheme() {
        return body.classList.contains('dark-mode') ? 'dark' : 'light';
    }

    function updateThemeIcon(theme) {
        const ariaAction = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        if (theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'Dark Mode';
        }
        themeToggleBtn.setAttribute('aria-label', ariaAction);

        // Sync presentation theme toggles
        document.querySelectorAll('.pres-theme-toggle').forEach(btn => {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            if (theme === 'dark') {
                icon.className = 'fa-solid fa-sun';
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fa-solid fa-moon';
                text.textContent = 'Dark Mode';
            }
            btn.setAttribute('aria-label', ariaAction);
        });
    }


    // --- Mobile Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    const overlay = document.createElement('div');
    overlay.classList.add('sidebar-overlay');
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        const isOpen = sidebar.classList.contains('open');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        hamburgerBtn.querySelector('i').classList.replace(
            isOpen ? 'fa-bars' : 'fa-xmark',
            isOpen ? 'fa-xmark' : 'fa-bars'
        );
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        const icon = hamburgerBtn.querySelector('i');
        if (icon.classList.contains('fa-xmark')) {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    }

    hamburgerBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);


    // --- Navigation & Single Page Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section-pane');

    let currentSection = 'home';

    // Presentation state — declared early because navigateToSection references it
    const pres = {
        active: false,
        moduleId: null,
        currentSlide: 0,
        slides: [],
        slideItems: [],
        chapters: [],
        container: null
    };

    function navigateToSection(sectionId) {
        if (sectionId === currentSection && pres.active && pres.moduleId === sectionId) return;
        currentSection = sectionId;

        const targetSection = document.getElementById(sectionId);
        const isPresentationSection = !!(targetSection && targetSection.querySelector('.presentation-container'));

        // Exit presentation mode if the destination isn't a presentation section
        if (pres.active && !isPresentationSection) {
            pres.active = false;
            body.classList.remove('presentation-mode');
        }

        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        if (targetSection) {
            targetSection.classList.add('active');
        }

        const targetLink = document.querySelector(`.nav-links a[data-section="${sectionId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.scrollTo({ top: 0 });
        }
        closeSidebar();

        // Enter presentation mode for any section that has a presentation container
        if (isPresentationSection) {
            enterPresentation(sectionId);
        }
    }

    // Handle initial load with hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        navigateToSection(initialHash);
    } else {
        navigateToSection('home');
    }

    // Handle hash changes
    window.addEventListener('hashchange', () => {
        let hash = window.location.hash.replace('#', '');
        if (!hash) hash = 'home';
        navigateToSection(hash);
    });


    // ============================================
    // PRESENTATION ENGINE
    // ============================================

    function enterPresentation(moduleId) {
        const section = document.getElementById(moduleId);
        if (!section) return;
        const container = section.querySelector('.presentation-container');
        if (!container) return;

        pres.active = true;
        pres.moduleId = moduleId;
        pres.container = container;
        pres.slides = Array.from(container.querySelectorAll('.pres-slide'));
        pres.slideItems = Array.from(container.querySelectorAll('.pres-slide-item'));
        pres.chapters = Array.from(container.querySelectorAll('.pres-chapter'));

        body.classList.add('presentation-mode');

        // Sync theme toggle state for this module's presentation sidebar
        updateThemeIcon(currentTheme());

        // Load saved progress
        const saved = localStorage.getItem(`vub_fin_${moduleId}_progress`);
        const startIndex = saved ? Math.max(0, Math.min(parseInt(saved, 10) || 0, pres.slides.length - 1)) : 0;
        updatePresSlide(startIndex);

        // Move focus to the slide area
        const slideArea = container.querySelector('.pres-slide-area');
        if (slideArea) slideArea.focus({ preventScroll: true });
    }

    function exitPresentation(navigate) {
        const moduleId = pres.moduleId;
        pres.active = false;
        pres.container = null;
        pres.slides = [];
        pres.slideItems = [];
        pres.chapters = [];
        body.classList.remove('presentation-mode');

        // Restore focus to the relevant nav link
        if (moduleId) {
            const navLink = document.querySelector(`.nav-links a[data-section="${moduleId}"]`);
            if (navLink) navLink.focus();
        }

        if (navigate !== false) {
            window.location.hash = 'home';
        }
    }

    function updatePresSlide(index) {
        if (!pres.active || index < 0 || index >= pres.slides.length) return;

        // Toggle active slide
        pres.slides.forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });

        // Update sidebar slide items
        pres.slideItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // Update chapter expansion — expand the chapter containing the active slide
        const activeChapter = pres.slides[index].dataset.chapter;
        pres.chapters.forEach(ch => {
            const isMatch = ch.dataset.chapter === activeChapter;
            ch.classList.toggle('expanded', isMatch);
        });

        // Update progress bar
        const progressFill = pres.container.querySelector('.pres-progress-fill');
        const progress = ((index + 1) / pres.slides.length) * 100;
        progressFill.style.width = `${progress}%`;

        // Update slide counter
        const currentEl = pres.container.querySelector('.pres-current');
        const totalEl = pres.container.querySelector('.pres-total');
        if (currentEl) currentEl.textContent = index + 1;
        if (totalEl) totalEl.textContent = pres.slides.length;

        // Update prev/next buttons
        const prevBtn = pres.container.querySelector('.pres-prev');
        const nextBtn = pres.container.querySelector('.pres-next');
        prevBtn.disabled = index === 0;

        if (index === pres.slides.length - 1) {
            nextBtn.innerHTML = 'Finish <i class="fa-solid fa-check"></i>';
            nextBtn.classList.add('pres-finish');
        } else {
            nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
            nextBtn.classList.remove('pres-finish');
        }

        // Confetti on completion slide
        if (pres.slides[index].classList.contains('pres-slide-completion')) {
            showConfetti();
        }

        pres.currentSlide = index;
        localStorage.setItem(`vub_fin_${pres.moduleId}_progress`, index);

        // Scroll slide area to top
        const slideArea = pres.container.querySelector('.pres-slide-area');
        if (slideArea) slideArea.scrollTop = 0;
    }


    // --- Event Delegation for Presentation Controls ---
    function handlePresAction(e) {
        // Presentation theme toggle
        if (e.target.closest('.pres-theme-toggle')) {
            toggleTheme();
            return;
        }

        if (!pres.active) return;

        // Next button
        if (e.target.closest('.pres-next')) {
            if (pres.currentSlide < pres.slides.length - 1) {
                updatePresSlide(pres.currentSlide + 1);
            } else {
                exitPresentation();
            }
            return;
        }

        // Prev button
        if (e.target.closest('.pres-prev')) {
            if (pres.currentSlide > 0) {
                updatePresSlide(pres.currentSlide - 1);
            }
            return;
        }

        // Slide item click (jump to slide)
        const slideItem = e.target.closest('.pres-slide-item');
        if (slideItem) {
            const slideIndex = parseInt(slideItem.dataset.slide, 10);
            if (!isNaN(slideIndex)) updatePresSlide(slideIndex);
            return;
        }

        // Chapter header toggle
        const chapterHeader = e.target.closest('.pres-chapter-header');
        if (chapterHeader) {
            const chapter = chapterHeader.closest('.pres-chapter');
            chapter.classList.toggle('expanded');
            return;
        }

        // Back button
        if (e.target.closest('.pres-back-btn')) {
            exitPresentation();
            return;
        }
    }

    document.addEventListener('click', handlePresAction);

    // Keyboard activation for chapter headers and slide items
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const chapterHeader = e.target.closest('.pres-chapter-header');
            if (chapterHeader) {
                e.preventDefault();
                const chapter = chapterHeader.closest('.pres-chapter');
                chapter.classList.toggle('expanded');
                return;
            }

            const slideItem = e.target.closest('.pres-slide-item');
            if (slideItem && pres.active) {
                e.preventDefault();
                const slideIndex = parseInt(slideItem.dataset.slide, 10);
                if (!isNaN(slideIndex)) updatePresSlide(slideIndex);
                return;
            }
        }
    });


    // --- Keyboard Navigation ---
    document.addEventListener('keydown', (e) => {
        if (!pres.active) return;

        // Don't capture keys if user is on an interactive sidebar element or input
        const tag = document.activeElement.tagName.toLowerCase();
        const isInteractive = tag === 'button' || tag === 'input' || tag === 'textarea'
            || document.activeElement.closest('.pres-chapter-header')
            || document.activeElement.closest('.pres-slide-item');
        if (e.key === ' ' && isInteractive) return;

        switch (e.key) {
            case 'ArrowRight':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                if (pres.currentSlide < pres.slides.length - 1) {
                    updatePresSlide(pres.currentSlide + 1);
                }
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                if (pres.currentSlide > 0) {
                    updatePresSlide(pres.currentSlide - 1);
                }
                break;
            case 'Home':
                e.preventDefault();
                updatePresSlide(0);
                break;
            case 'End':
                e.preventDefault();
                updatePresSlide(pres.slides.length - 1);
                break;
            case 'Escape':
                exitPresentation();
                break;
        }
    });


    // --- Touch/Swipe Support ---
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        if (!pres.active) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (!pres.active) return;
        const deltaX = e.changedTouches[0].screenX - touchStartX;
        const deltaY = e.changedTouches[0].screenY - touchStartY;

        // Only register horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0 && pres.currentSlide < pres.slides.length - 1) {
                updatePresSlide(pres.currentSlide + 1);
            } else if (deltaX > 0 && pres.currentSlide > 0) {
                updatePresSlide(pres.currentSlide - 1);
            }
        }
    }, { passive: true });


    // --- Confetti ---
    let confettiTimer = null;

    function showConfetti() {
        // Skip DOM injection if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let container = document.getElementById('confetti-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'confetti-container';
            document.body.appendChild(container);
        }

        // Clear any pending cleanup from a previous confetti burst
        if (confettiTimer) clearTimeout(confettiTimer);

        container.innerHTML = '';
        container.classList.add('active');

        const colors = ['#1e3a8a', '#fbbf24', '#3b82f6', '#10b981', '#ef4444'];
        for (let i = 0; i < 100; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = Math.random() * 2 + 's';
            piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(piece);
        }

        confettiTimer = setTimeout(() => {
            container.classList.remove('active');
            container.innerHTML = '';
            confettiTimer = null;
        }, 5000);
    }

});
