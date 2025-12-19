
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('menu-close');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        // Optional: Animate hamburger
        hamburger.classList.toggle('active');
    }

    if (hamburger) {
        hamburger.addEventListener('click', toggleMenu);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', toggleMenu);
    }

    // Close on link click
    const links = document.querySelectorAll('.nav-links-mobile a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});
