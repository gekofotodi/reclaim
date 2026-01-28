/**
 * HACKER TEXT EFFECT (FONT-AWARE VERSION)
 * 1. Width-Matching Buckets (Narrow, Wide, Standard).
 * 2. Excludes 'I', 'i', '-' (Static).
 * 3. FONT DETECTION: Symbols are used ONLY if the font is "Neue Haas Unica".
 * If the font is "Codeink", only letters/numbers are used.
 */

document.addEventListener('DOMContentLoaded', () => {
    document.fonts.ready.then(() => {
        initHackerEffect();
    });

    function initHackerEffect() {
        const targets = document.querySelectorAll('.scrolling-track, .page-title-hacker, h1');
        if (targets.length === 0) return;

        targets.forEach(target => {
            if (target.dataset.hackerProcessed) return;
            target.dataset.hackerProcessed = 'true';

            let spans = Array.from(target.querySelectorAll('span'));
            if (spans.length === 0 && target.textContent.trim().length > 0) {
                const text = target.textContent;
                target.innerHTML = `<span>${text}</span>`;
                spans = Array.from(target.querySelectorAll('span'));
            }

            if (spans.length === 0) return;

            const fragment = document.createDocumentFragment();

            spans.forEach(span => {
                const text = span.textContent;
                const phraseContainer = document.createElement('span');
                phraseContainer.className = 'phrase-container';
                phraseContainer.style.display = 'inline-block';
                phraseContainer.style.whiteSpace = 'pre';
                phraseContainer.style.pointerEvents = 'auto';

                if (target.classList.contains('scrolling-track')) {
                    phraseContainer.style.paddingRight = '2rem';
                }

                text.split('').forEach(char => {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = (char === ' ') ? '\u00A0' : char;
                    charSpan.dataset.char = char;

                    // SE È UNO SPAZIO, FORZIAMO LA LARGHEZZA
                    if (char === ' ') {
                        charSpan.style.width = '0.5em'; // O '10px', decidi tu quanto spazio vuoi
                        charSpan.style.display = 'inline-block';
                    }

                    // Esclusione caratteri statici (I, i, -)
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

            target.innerHTML = '';
            target.appendChild(fragment);

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

            target.addEventListener('mouseover', (e) => {
                const t = e.target;
                if (t.classList.contains('hacker-char')) {
                    triggerHackerEffect(t);
                }
            });
        });
    }

    /**
     * Triggers the animation based on Font Family and Character Width.
     */
    function triggerHackerEffect(element) {
        if (element.dataset.interval) return;

        const originalChar = element.dataset.char;
        if (originalChar === ' ' || originalChar === '\u00A0' || originalChar === 'I' || originalChar === 'i' || originalChar === '-') return;

        // --- 1. RILEVAMENTO DEL FONT ---
        // Otteniamo lo stile calcolato dal browser per questo elemento specifico
        const computedStyle = window.getComputedStyle(element);
        const fontFamily = computedStyle.fontFamily.toLowerCase();

        // Variabile booleana: Vero solo se il font contiene "unica" (Neue Haas Unica)
        // Se è "Codeink" o altro, sarà false.
        const allowSymbols = fontFamily.includes('unica');

        // --- 2. DEFINIZIONE DEI GRUPPI (Base vs Simboli) ---

        // GRUPPO STRETTO (Narrow)
        const narrowBase = "1JLT";           // Solo lettere/numeri
        const narrowSymb = "!|[]():;.,'";    // Solo simboli

        // GRUPPO LARGO (Wide)
        const wideBase = "WM";               // Solo lettere
        const wideSymb = "@%#";              // Solo simboli

        // GRUPPO STANDARD
        const standardBase = "ABCDEFGHKNOPQRSUVXYZ023456789";
        const standardSymb = "$?+*^&~=";

        // --- 3. COSTRUZIONE DELLA POOL ---
        let pool = "";
        const checkChar = originalChar.toUpperCase();

        // Funzione helper per combinare base + simboli (se permessi)
        const getPool = (base, symb) => {
            return allowSymbols ? base + symb : base;
        };

        // Logica di selezione larghezza
        if ((narrowBase + narrowSymb).includes(checkChar)) {
            pool = getPool(narrowBase, narrowSymb);
        } else if ((wideBase + wideSymb).includes(checkChar)) {
            pool = getPool(wideBase, wideSymb);
        } else {
            pool = getPool(standardBase, standardSymb);
        }

        // Se per qualche motivo la pool è vuota (caso limite), usa un fallback sicuro
        if (pool === "") pool = standardBase;

        let lifetime = 0;
        const speed = 40;

        const interval = setInterval(() => {
            element.textContent = pool[Math.floor(Math.random() * pool.length)];

            lifetime++;
            if (lifetime > 8) {
                clearInterval(interval);
                element.textContent = originalChar;
                delete element.dataset.interval;
            }
        }, speed);

        element.dataset.interval = interval;
    }
});