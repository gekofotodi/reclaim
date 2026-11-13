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
        // F3: titoli di sezione di tutte le pagine (Codeink e Neue Haas) + voci di menu
        const targets = document.querySelectorAll(
            '.scrolling-track, .hk, .nav-links-mobile .nav-name, ' +
            'main h1, main h2, main h3, .catalog-title'
        );
        if (targets.length === 0) return;

        targets.forEach(target => {
            if (target.dataset.hackerProcessed) return;
            // titoli riempiti dagli script (es. scheda del kit): niente effetto
            if (target.closest('.sheet, .checkout, [data-no-hk]')) return;
            if (target.children.length && !target.classList.contains('scrolling-track')) {
                // contiene altri elementi (link, br...): non lo tocchiamo per non perderli
                if (target.querySelector(':not(span)')) return;
            }
            target.dataset.hackerProcessed = 'true';

            let spans = Array.from(target.querySelectorAll('span'));
            if (spans.length === 0 && target.textContent.trim().length > 0) {
                const text = target.textContent.trim().replace(/\s+/g, ' ');
                target.setAttribute('aria-label', text);
                target.innerHTML = `<span>${text}</span>`;
                spans = Array.from(target.querySelectorAll('span'));
            }

            if (spans.length === 0) return;

            const isTrack = target.classList.contains('scrolling-track');
            const fragment = document.createDocumentFragment();

            const makeChar = (char) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = (char === ' ') ? '\u00A0' : char;
                charSpan.dataset.char = char;
                if (char === ' ') charSpan.style.width = '0.5em';
                // Esclusione caratteri statici (I, i, -)
                charSpan.className = (char !== ' ' && char !== 'I' && char !== 'i' && char !== '-') ? 'hacker-char' : 'static-char';
                charSpan.style.display = 'inline-block';
                charSpan.style.position = 'relative';
                charSpan.setAttribute('aria-hidden', 'true');
                return charSpan;
            };

            spans.forEach(span => {
                const text = span.textContent;
                const phraseContainer = document.createElement('span');
                phraseContainer.className = 'phrase-container';

                if (isTrack) {
                    // il titolo che scorre resta su una riga sola
                    phraseContainer.style.display = 'inline-block';
                    phraseContainer.style.whiteSpace = 'pre';
                    phraseContainer.style.paddingRight = '2rem';
                    text.split('').forEach(c => phraseContainer.appendChild(makeChar(c)));
                } else {
                    // F3/F5: ogni parola è un blocco unico, ma il titolo può andare a capo tra le parole
                    text.split(' ').forEach((word, i, arr) => {
                        const w = document.createElement('span');
                        w.className = 'hk-word';
                        w.style.display = 'inline-block';
                        w.style.whiteSpace = 'nowrap';
                        word.split('').forEach(c => w.appendChild(makeChar(c)));
                        phraseContainer.appendChild(w);
                        if (i < arr.length - 1) phraseContainer.appendChild(document.createTextNode(' '));
                    });
                }

                fragment.appendChild(phraseContainer);
            });

            target.innerHTML = '';
            target.appendChild(fragment);

            requestAnimationFrame(() => measure(target));

            // nel menu l'effetto parte solo all'apertura, non al passaggio del mouse (F1)
            if (!target.classList.contains('nav-name')) target.addEventListener('mouseover', (e) => {
                const t = e.target;
                if (t.classList.contains('hacker-char')) {
                    triggerHackerEffect(t);
                }
            });

            // una volta quando entra nello schermo
            observeOnce(target);
        });

        // le misure dei titoli cambiano con la finestra (caratteri fluidi): si rimisurano
        let rt;
        let lastW = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth === lastW) return;
            lastW = window.innerWidth;
            clearTimeout(rt);
            rt = setTimeout(() => document.querySelectorAll('[data-hacker-processed]').forEach(measure), 150);
        });
    }

    // ogni lettera prende la larghezza della lettera vera, così mescolando non sposta il testo
    function measure(target) {
        const chars = target.querySelectorAll('.hacker-char');
        chars.forEach(c => { if (!c.dataset.interval) c.style.width = ''; });
        const widths = Array.from(chars).map(c => c.getBoundingClientRect().width);
        chars.forEach((c, i) => {
            if (widths[i] > 0) {
                c.style.width = `${widths[i]}px`;
                c.style.textAlign = 'center';
            }
        });
    }

    // Entrata: ogni lettera si mescola una volta, con un piccolo ritardo a cascata
    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (!en.isIntersecting) return;
            io.unobserve(en.target);
            scrambleAll(en.target);
        });
    }, { threshold: 0.3 }) : null;

    function observeOnce(target) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        // le voci di menu si mescolano a ogni apertura
        if (target.classList.contains('nav-name')) return;
        if (io) io.observe(target);
    }

    function scrambleAll(target) {
        const chars = target.querySelectorAll('.hacker-char');
        chars.forEach((c, i) => setTimeout(() => triggerHackerEffect(c), Math.min(i * 18, 600)));
    }

    const menu = document.getElementById('mobile-menu');
    if (menu) {
        new MutationObserver(() => {
            if (menu.classList.contains('active')) menu.querySelectorAll('.nav-name').forEach(scrambleAll);
        }).observe(menu, { attributes: true, attributeFilter: ['class'] });
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

            // Force Orange Color during animation
            element.style.color = '#ff3c01';

            lifetime++;
            if (lifetime > 8) {
                clearInterval(interval);
                element.textContent = originalChar;
                element.style.color = ''; // Reset color
                delete element.dataset.interval;
            }
        }, speed);

        element.dataset.interval = interval;
    }
});