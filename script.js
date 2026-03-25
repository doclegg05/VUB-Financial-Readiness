document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeText = themeToggleBtn.querySelector('span');
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        updateThemeIcon('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon('dark');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light');
            updateThemeIcon('light');
        }
    });

    function updateThemeIcon(theme) {
        if(theme === 'dark') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            themeText.textContent = 'Dark Mode';
        }
    }


    // --- Navigation & Single Page Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section-pane');

    function navigateToSection(sectionId) {
        // Remove active class from all nav links and sections
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        // Add active class to target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to clicked nav link
        const targetLink = document.querySelector(`.nav-links a[data-section="${sectionId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        // Scroll to top of content area on page change
        document.querySelector('.content-area').scrollTo({top: 0, behavior: 'smooth'});
    }

    // Handle initial load with hash
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && document.getElementById(initialHash)) {
        navigateToSection(initialHash);
    } else {
        navigateToSection('home');
    }

    // Handle hash changes globally
    window.addEventListener('hashchange', () => {
        let hash = window.location.hash.replace('#', '');
        if (!hash) hash = 'home';
        navigateToSection(hash);
    });

});
