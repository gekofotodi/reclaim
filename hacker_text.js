/**
 * HACKER TEXT EFFECT
 * This script creates a "glitch" animation for specified text elements on hover.
 * It targets scrolling tracks, page titles, and all h1 headers.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts to be ready to ensure accurate character width measurements.
    // This prevents layout shifts when characters are replaced during the animation.
    document.fonts.ready.then(() => {
        initHackerEffect();
    });

    /**
     * Initializes the hacker effect on all matching elements.
     * It breaks down text into individual <span> elements for character-level control.
     */
    function initHackerEffect() {
        // Select targets: scrolling tracks, specific title classes, and general headers
        const targets = document.querySelectorAll('.scrolling-track, .page-title-hacker, h1');
        if (targets.length === 0) return;

        targets.forEach(target => {
            // Avoid re-processing if the script runs multiple times
            if (target.dataset.hackerProcessed) return;
            target.dataset.hackerProcessed = 'true';

            // Use textContent instead of innerText to preserve all whitespace characters
            let spans = Array.from(target.querySelectorAll('span'));
            if (spans.length === 0 && target.textContent.trim().length > 0) {
                const text = target.textContent;
                target.innerHTML = `<span>${text}</span>`;
                spans = Array.from(target.querySelectorAll('span'));
            }

            if (spans.length === 0) return;

            const fragment = document.createDocumentFragment();

            // Process each phrase/span within the target
            spans.forEach(span => {
                const text = span.textContent;
                const phraseContainer = document.createElement('span');
                phraseContainer.className = 'phrase-container';
                phraseContainer.style.display = 'inline-block';
                phraseContainer.style.whiteSpace = 'pre'; // Preserve spaces within the container
                phraseContainer.style.pointerEvents = 'auto';

                // Add horizontal spacing for scrolling tracks to prevent clipping
                if (target.classList.contains('scrolling-track')) {
                    phraseContainer.style.paddingRight = '2rem';
                }

                // Split text into individual characters
                text.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    // Convert regular spaces to non-breaking spaces for display stability in spans
                    charSpan.textContent = (char === ' ') ? '\u00A0' : char;
                    charSpan.dataset.char = char;

                    // Exclude specific characters (spaces, 'I', hyphens) from the glitch effect
                    if (char !== ' ' && char !== '\u00A0' && char !== 'I' && char !== 'i' && char !== '-') {
                        charSpan.className = 'hacker-char';
                    } else {
                        charSpan.className = 'static-char';
                    }

                    charSpan.style.display = 'inline-block';
                    charSpan.style.pointerEvents = 'auto';
                    charSpan.style.position = 'relative';

                    phraseContainer.appendChild(charSpan);
                });

                fragment.appendChild(phraseContainer);
            });

            // Replace original content with the atomized spans
            target.innerHTML = '';
            target.appendChild(fragment);

            /**
             * BATCHED MEASUREMENT:
             * Performance optimization to avoid "Layout Thrashing".
             * We read all widths in one go and then apply min-width styles.
             * This keeps the layout stable even if a replacement character is narrower.
             */
            requestAnimationFrame(() => {
                const allChars = target.querySelectorAll('.hacker-char');
                const measurements = Array.from(allChars).map(c => ({
                    el: c,
                    rect: c.getBoundingClientRect()
                }));

                measurements.forEach(m => {
                    const w = m.rect.width;
                    if (w > 0) {
                        m.el.style.width = `${w}px`;
                        m.el.style.textAlign = 'center';
                        m.el.style.display = 'inline-block';
                    }
                });
            });

            // Add event listener to trigger the effect on hover
            target.addEventListener('mouseover', (e) => {
                const t = e.target;
                if (t.classList.contains('hacker-char')) {
                    triggerHackerEffect(t);
                }
            });
        });
    }

    /**
     * Triggers the random character cycling for a specific element.
     * @param {HTMLElement} element - The character span to animate.
     */
    function triggerHackerEffect(element) {
        // Prevent overlapping animations
        if (element.dataset.interval) return;

        const originalChar = element.dataset.char;
        // Safety check for excluded characters
        if (originalChar === ' ' || originalChar === '\u00A0' || originalChar === 'I' || originalChar === 'i' || originalChar === '-') return;

        // Choose character pool based on whether the original was a number or letter
        const isDigit = /\d/.test(originalChar);
        const pool = isDigit ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let lifetime = 0;
        const speed = 40; // MS between character swaps

        const interval = setInterval(() => {
            // Replace with a random character from the pool
            element.textContent = pool[Math.floor(Math.random() * pool.length)];

            lifetime++;
            // Stop after ~320ms (8 iterations * 40ms)
            if (lifetime > 8) {
                clearInterval(interval);
                element.textContent = originalChar; // Restore original
                delete element.dataset.interval;
            }
        }, speed);

        element.dataset.interval = interval;
    }
});
