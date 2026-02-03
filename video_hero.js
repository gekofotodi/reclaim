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

    // Mobile: Move Label into Video Wrapper to "accompany" it during scaling
    if (window.innerWidth <= 768 && videoWrapper && playLabel) {
        videoWrapper.appendChild(playLabel);
    }


    if (!videoWrapper || !playLabel) return;

    const togglePlayLabel = (show) => {
        // Se il modale è attivo, non mostrare mai la label PLAY
        if (videoModal && videoModal.classList.contains('active')) {
            playLabel.classList.remove('active');
            if (customCursor) customCursor.style.opacity = '1';
            return;
        }

        playLabel.classList.toggle('active', show);
        if (customCursor) {
            customCursor.style.opacity = show ? '0' : '1';
        }
    };

    let isMouseInside = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Track mouse position globally to handle stationary mouse on scroll
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return; // Disable on Mobile

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        // If mouse moves inside the video, update the label position immediately
        if (isMouseInside) {
            playLabel.style.left = `${lastMouseX}px`;
            playLabel.style.top = `${lastMouseY}px`;
        }
    });


    // 1. Scroll Zoom & Radius Effect + Mouse Intersection Check
    const handleScrollAnimation = () => {
        if (!videoOuter || !videoWrapper) return;

        const rect = videoOuter.getBoundingClientRect();
        const wrapperRect = videoWrapper.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // --- EXPANSION LOGIC ---
        const triggerStart = viewportHeight * 0.9;
        const triggerEnd = viewportHeight * 0.1;

        let progress = 0;
        if (rect.top < triggerStart) {
            let relativePos = (triggerStart - rect.top) / (triggerStart - triggerEnd);

            // Mobile: 70% faster expansion
            if (window.innerWidth <= 768) {
                progress = relativePos * 1.7; // Multiply by 1.7 to speed up (70% faster)
            } else {
                progress = relativePos;
            }

            progress = Math.min(Math.max(progress, 0), 1);
        }

        const scale = 0.5 + (0.5 * progress);
        videoWrapper.style.transform = `scale(${scale})`;

        if (progress >= 0.99) {
            videoWrapper.style.width = '100.2vw';
            videoWrapper.style.maxWidth = '100vw';
            videoWrapper.classList.add('is-expanded');
        } else {
            videoWrapper.style.width = '';
            videoWrapper.style.maxWidth = '';
            videoWrapper.classList.remove('is-expanded');
        }

        // --- MOUSE INTERSECTION CHECK (FOR STATIONARY MOUSE ON SCROLL) ---
        if (window.innerWidth > 768) {
            const mouseInX = lastMouseX >= wrapperRect.left && lastMouseX <= wrapperRect.right;
            const mouseInY = lastMouseY >= wrapperRect.top && lastMouseY <= wrapperRect.bottom;
            isMouseInside = mouseInX && mouseInY;

            if (isMouseInside) {
                togglePlayLabel(true);
                playLabel.style.left = `${lastMouseX}px`;
                playLabel.style.top = `${lastMouseY}px`;
            } else {
                togglePlayLabel(false);
            }
        }

    };

    // Use requestAnimationFrame for smooth scroll handling
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                handleScrollAnimation();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // 2. Mouse Interaction
    videoWrapper.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        isMouseInside = true;
        togglePlayLabel(true);
        playLabel.style.left = `${e.clientX}px`;
        playLabel.style.top = `${e.clientY}px`;
    });

    videoWrapper.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 768) return;
        isMouseInside = true;
        togglePlayLabel(true);
    });

    videoWrapper.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 768) return;
        isMouseInside = false;
        togglePlayLabel(false);
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
            document.body.classList.add('modal-open'); // Restore default cursor
            document.body.style.overflow = 'hidden'; // Lock scroll
            togglePlayLabel(false);
        }
    });

    // 4. Close Modal
    const closeModal = () => {
        videoModal.classList.remove('active');
        document.body.classList.remove('modal-open'); // Revert to logo cursor
        document.body.style.overflow = '';
        setTimeout(() => {
            modalContainer.innerHTML = '';
        }, 500);
        if (customCursor) customCursor.style.opacity = '1';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
    }

    // Initial check on load
    handleScrollAnimation();
});
