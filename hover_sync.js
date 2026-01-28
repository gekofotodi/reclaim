/**
 * Global Hover & Scroll Sync - Premium Implementation
 * Detects hover states even when scrolling with a stationary mouse.
 */

(function () {
    let lastMouseX = 0;
    let lastMouseY = 0;
    let scrollTicking = false;

    // List of selectors that have hover effects we want to sync
    const hoverSelectors = [
        'a',
        'button',
        '.info-item',
        '.nav-logo',
        '.hamburger-menu',
        '.hacker-char',
        '.map-marker',
        '. news-ticker-bar',
        '.cta-button',
        '.close-modal'
    ];

    const allHoverElements = () => document.querySelectorAll(hoverSelectors.join(', '));

    // Track mouse position globally
    window.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    /**
     * Checks if the mouse is over an element and triggers hover state manually.
     * Since we can't force the browser's CSS :hover state, we toggle a class.
     */
    function syncHoverStates() {
        const elements = allHoverElements();

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInside = (
                lastMouseX >= rect.left &&
                lastMouseX <= rect.right &&
                lastMouseY >= rect.top &&
                lastMouseY <= rect.bottom
            );

            // Toggle a 'js-hover' class that we will mirror in CSS
            if (isInside) {
                if (!el.classList.contains('js-hover')) {
                    el.classList.add('js-hover');
                    // Trigger custom events if needed (like hacker effect)
                    if (el.classList.contains('hacker-char')) {
                        const event = new MouseEvent('mouseover', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        el.dispatchEvent(event);
                    }
                }
            } else {
                el.classList.remove('js-hover');
            }
        });
    }

    // sync on scroll using requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                syncHoverStates();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Mirror .js-hover to :hover in CSS dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        /* Mirroring common hover states for elements that use JS sync */
        a.js-hover { color: #ffffff !important; opacity: 1 !important; }
        .nav-logo.js-hover { transform: scale(1.05); }
        .cta-button.js-hover { background-color: #e63600; transform: translateY(-3px); box-shadow: 0 8px 25px rgba(255, 60, 1, 0.5); opacity: 1; }
        .info-item.js-hover { background-color: #ff3c01; color: #000000; }
        .info-item.js-hover::after { opacity: 1; transform: translateY(0); display: block; }
        .map-marker.js-hover { transform: scale(1.2); }
        .map-marker.js-hover::after { opacity: 1; transform: translateX(-50%) translateY(0); display: block; }
        .hacker-char.js-hover { color: #ff3c01; }
        .news-ticker-bar.js-hover { opacity: 0.9; }
        .static-char.js-hover { color: #ff3c01; }
    `;
    document.head.appendChild(style);
})();
