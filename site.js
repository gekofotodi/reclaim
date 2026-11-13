/**
 * site.js — comportamenti comuni a tutte le pagine
 * 1. menu accessibile da tastiera
 * 2. entrata dei contenuti allo scroll (I8)
 * 3. timbro a sgocciolo dove si clicca / doppio tocco su mobile (I2)
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

    /* --- 3. Timbri ---------------------------------------------------------- */
    function initStamps() {
        const MAX = 30;
        const live = [];
        const layer = document.createElement('div');
        layer.id = 'stamp-layer';
        layer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(layer);

        const blocked = 'a, button, input, select, textarea, label, [role="button"], .hamburger-menu, ' +
            '.mobile-menu-overlay, footer, .info-bar, .news-ticker-bar, .main-navbar, .video-wrapper, ' +
            '.video-modal, .manifesto-wrapper, .map-marker, .city-list, .hotspot, .sheet, .checkout, ' +
            '.catalog-item, .cta-container, #particle-canvas';

        const stamp = (x, y) => {
            const s = document.createElement('div');
            s.className = 'stamp';
            const size = 46 + Math.random() * 44;          // 46–90 px
            const rot = (Math.random() - 0.5) * 70;         // ±35°
            s.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--rot:${rot}deg`;
            layer.appendChild(s);
            live.push(s);
            // oltre i 30 il più vecchio sbiadisce e sparisce
            while (live.length > MAX) {
                const old = live.shift();
                old.classList.add('fade');
                setTimeout(() => old.remove(), 600);
            }
        };

        const allowed = (target) => !document.body.classList.contains('modal-open') && !target.closest(blocked);

        if (!isTouch) {
            document.addEventListener('click', (e) => {
                if (e.button !== 0 || !allowed(e.target)) return;
                stamp(e.pageX, e.pageY);
            });
        } else {
            // doppio tocco sulle aree vuote
            let last = { t: 0, x: 0, y: 0 };
            document.addEventListener('touchend', (e) => {
                if (e.changedTouches.length !== 1) return;
                const tch = e.changedTouches[0];
                const now = Date.now();
                const near = Math.hypot(tch.pageX - last.x, tch.pageY - last.y) < 40;
                if (now - last.t < 320 && near && allowed(e.target)) {
                    stamp(tch.pageX, tch.pageY);
                    last = { t: 0, x: 0, y: 0 };
                } else {
                    last = { t: now, x: tch.pageX, y: tch.pageY };
                }
            }, { passive: true });
        }
    }
})();
