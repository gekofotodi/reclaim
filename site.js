/**
 * site.js — comportamenti comuni a tutte le pagine
 * 1. menu accessibile da tastiera
 * 2. entrata dei contenuti allo scroll (I8)
 * 3. timbro del logo dove si clicca, solo desktop (I2)
 */
(function () {
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', () => {
        initMenuA11y();
        initReveal();
        initStamps();
    });

    /* --- 1. Menu ------------------------------------------------------------ */
    function initMenuA11y() {
        const btn = document.getElementById('hamburger-btn');
        const menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;
        const sync = () => {
            const open = menu.classList.contains('active');
            btn.setAttribute('aria-expanded', open);
            document.documentElement.classList.toggle('menu-open', open);
        };
        new MutationObserver(sync).observe(menu, { attributes: true, attributeFilter: ['class'] });
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) { btn.click(); btn.focus(); }
        });
    }

    /* --- 2. Entrata: sale di 16px e passa da 0.6 a 1 ------------------------- */
    function initReveal() {
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        const sel = '.app-split-section, .catalog-item, .manifesto-text, .cta-static, .kit-card, .gun-note, .scn-reveal';
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll(sel).forEach(el => {
            // solo ciò che è sotto la piega: quello già visibile non deve "saltare"
            if (el.getBoundingClientRect().top < window.innerHeight) return;
            el.classList.add('rv');
            io.observe(el);
        });
    }

    /* --- 3. Timbri (solo desktop: su touch non c'è cursore) ------------------ */
    function initStamps() {
        if (isTouch || window.matchMedia('(pointer: coarse)').matches) return;
        const MAX = 30;
        const live = [];
        const layer = document.createElement('div');
        layer.id = 'stamp-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);

        // ink bleed: bordo appena irregolare + alone morbido, statico
        const svgNS = 'http://www.w3.org/2000/svg';
        const defs = document.createElementNS(svgNS, 'svg');
        defs.setAttribute('width', '0');
        defs.setAttribute('height', '0');
        defs.setAttribute('aria-hidden', 'true');
        defs.style.position = 'absolute';
        defs.innerHTML =
            '<filter id="ink-bleed" x="-40%" y="-40%" width="180%" height="180%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>' +
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="1.4" xChannelSelector="R" yChannelSelector="G" result="d"/>' +
            '<feGaussianBlur in="d" stdDeviation="0.7" result="b"/>' +
            '<feComponentTransfer in="b" result="halo"><feFuncA type="linear" slope="0.55"/></feComponentTransfer>' +
            '<feMerge><feMergeNode in="halo"/><feMergeNode in="d"/></feMerge>' +
            '</filter>';
        document.body.appendChild(defs);

        const blocked = 'a, button, input, select, textarea, label, [role="button"], .hamburger-menu, ' +
            '.mobile-menu-overlay, footer, .info-bar, .news-ticker-bar, .main-navbar, .video-wrapper, ' +
            '.video-modal, .manifesto-wrapper, .map-marker, .city-list, .hotspot, .sheet, .checkout, ' +
            '.catalog-item, .cta-container, #particle-canvas';

        const stamp = (x, y) => {
            const s = document.createElement('img');
            s.className = 'stamp';
            s.src = 'asset/immagini/logo_orange.png';
            s.alt = '';
            s.style.left = x + 'px';
            s.style.top = y + 'px';
            layer.appendChild(s);
            live.push(s);
            // oltre i 30 il più vecchio sbiadisce e sparisce
            while (live.length > MAX) {
                const old = live.shift();
                old.classList.add('fade');
                setTimeout(() => old.remove(), 600);
            }
        };

        document.addEventListener('click', (e) => {
            if (e.button !== 0) return;
            if (document.body.classList.contains('modal-open') || e.target.closest(blocked)) return;
            stamp(e.pageX, e.pageY);
        });
    }
})();
