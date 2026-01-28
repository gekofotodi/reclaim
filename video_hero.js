/**
 * Video Hero Interactions - Premium Implementation
 * Creative Developer: Antigravity
 */

document.addEventListener('DOMContentLoaded', () => {
    const videoWrapper = document.getElementById('video-trigger');
    const playLabel = document.getElementById('play-btn');
    const videoOuter = document.querySelector('.video-hero-outer');
    const customCursor = document.getElementById('custom-cursor');

    // Modal Elements
    const videoModal = document.getElementById('video-modal');
    const modalContainer = document.getElementById('modal-iframe-container');
    const closeBtn = document.getElementById('close-modal');

    if (!videoWrapper || !playLabel) return;

    // We use a global variable to track the maximum progress reached (persistent expansion)
    window._videoAnimProgress = 0;

    // 1. Scroll Zoom & Radius Effect
    const handleScrollAnimation = () => {
        if (!videoOuter || !videoWrapper) return;

        const rect = videoOuter.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Expansion starts when the top of the section enters the bottom 80% of screen
        const triggerStart = viewportHeight * 0.9;
        // Expansion ends (full width) when the section is centered in viewport
        const triggerEnd = viewportHeight * 0.1;

        let progress = 0;

        if (rect.top < triggerStart) {
            progress = (triggerStart - rect.top) / (triggerStart - triggerEnd);
            progress = Math.min(Math.max(progress, 0), 1);
        }

        // Persistent expansion: only apply if new progress is higher than recorded max
        if (progress > window._videoAnimProgress) {
            window._videoAnimProgress = progress;

            // Animation values based on progress (0 to 1)
            const scale = 0.8 + (0.2 * window._videoAnimProgress); // from 0.8 to 1.0
            const radius = 60 - (48 * window._videoAnimProgress); // from 60px to 12px

            videoWrapper.style.transform = `scale(${scale})`;
            videoWrapper.style.borderRadius = `${radius}px`;

            // At 100% progress, we ensure it looks like full viewport width
            if (window._videoAnimProgress >= 1) {
                videoWrapper.style.width = '100.2vw'; // Slight overlap to ensure no gaps
                videoWrapper.style.maxWidth = '100vw';
            }
        }
    };

    window.addEventListener('scroll', handleScrollAnimation);

    // 2. Mouse Interaction (Cursor Replacement)
    videoWrapper.addEventListener('mousemove', (e) => {
        playLabel.style.left = `${e.clientX}px`;
        playLabel.style.top = `${e.clientY}px`;
    });

    videoWrapper.addEventListener('mouseenter', () => {
        playLabel.style.opacity = '1';
        if (customCursor) customCursor.style.opacity = '0'; // Hide site cursor
    });

    videoWrapper.addEventListener('mouseleave', () => {
        playLabel.style.opacity = '0';
        if (customCursor) customCursor.style.opacity = '1'; // Show site cursor
    });

    // 3. Modal Play Logic
    videoWrapper.addEventListener('click', () => {
        const videoId = videoWrapper.getAttribute('data-video-id');

        if (videoId && videoModal) {
            modalContainer.innerHTML = `
                <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
            `;

            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scroll
            playLabel.style.opacity = '0';
        }
    });

    // 4. Close Modal
    const closeModal = () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalContainer.innerHTML = '';
        }, 500);
        if (customCursor) customCursor.style.opacity = '1';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (videoModal) videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });

    // Initial check on load
    handleScrollAnimation();
});
