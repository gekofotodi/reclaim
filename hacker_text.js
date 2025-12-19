document.addEventListener('DOMContentLoaded', () => {
    // Wait for fonts/layout
    // Wait for fonts/layout to be fully ready before measuring
    document.fonts.ready.then(() => {
        initHackerEffect();
    });

    function initHackerEffect() {
        const tracks = document.querySelectorAll('.scrolling-track, .page-title-hacker');
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        if (tracks.length === 0) return;

        tracks.forEach(track => {
            const phraseSpans = Array.from(track.querySelectorAll('span'));
            if (phraseSpans.length === 0) return;

            const fragment = document.createDocumentFragment();

            phraseSpans.forEach(phraseSpan => {
                const text = phraseSpan.innerText;

                const phraseContainer = document.createElement('span');
                phraseContainer.className = 'phrase-container';
                // Inline styles for stability
                phraseContainer.style.paddingRight = '2rem';
                phraseContainer.style.display = 'inline-block';
                phraseContainer.style.pointerEvents = 'auto'; // Force

                text.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    // Use textContent to ensure raw char
                    charSpan.textContent = char;
                    charSpan.dataset.char = char;

                    // Only add interaction class if not space/I/i/-
                    if (char !== ' ' && char !== '\u00A0' && char !== 'I' && char !== 'i' && char !== '-') {
                        charSpan.className = 'hacker-char';
                    } else {
                        charSpan.className = 'static-char'; // Just for styling if needed
                    }

                    // Initial styles
                    charSpan.style.display = 'inline-block';
                    charSpan.style.pointerEvents = 'auto';
                    charSpan.style.position = 'relative'; // Helps with z-index if needed

                    phraseContainer.appendChild(charSpan);
                });

                fragment.appendChild(phraseContainer);
            });

            // Clean replacement
            track.innerHTML = '';
            track.appendChild(fragment);

            // Force measure loop
            // We use requestAnimationFrame to ensure render happened
            requestAnimationFrame(() => {
                const allChars = track.querySelectorAll('.hacker-char');
                allChars.forEach(c => {
                    const rect = c.getBoundingClientRect();
                    const w = rect.width;
                    // Check if reasonable width (space might be small, I narrow chars might be small)
                    // If w is 0, layout failed. fallback to '0.6em' maybe?
                    if (w > 0) {
                        // Use min-width to preserve original spacing for thinner replacements
                        // Allow expansion for wider replacements to avoid overlap
                        c.style.minWidth = `${w}px`;
                        c.style.width = 'auto';
                    } else {
                        c.style.minWidth = 'auto';
                        c.style.width = 'auto';
                    }
                    c.style.textAlign = 'center';
                });
            });

            // Event Delegation on Track for robustness
            track.addEventListener('mouseover', (e) => {
                const target = e.target;
                if (target.classList.contains('hacker-char')) {
                    triggerGroup(target, track);
                }
            });
        });

        function triggerGroup(targetSpan, track) {
            // Trigger target only
            triggerHackerEffect(targetSpan);
        }


    }

    function triggerHackerEffect(element) {
        if (element.dataset.interval) return;

        const originalChar = element.dataset.char;
        // Check for space, non-breaking space, I, i
        if (originalChar === ' ' || originalChar === '\u00A0' || originalChar === 'I' || originalChar === 'i' || originalChar === '-') return;

        // Determine type for replacement
        const isDigit = /\d/.test(originalChar);
        const pool = isDigit ? "0123456789" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let lifetime = 0;
        const interval = setInterval(() => {
            element.textContent = pool[Math.floor(Math.random() * pool.length)];

            lifetime++;
            if (lifetime > 8) { // run for ~480ms
                clearInterval(interval);
                element.textContent = originalChar;
                delete element.dataset.interval;
            }
        }, 60);

        element.dataset.interval = interval;
    }

});
