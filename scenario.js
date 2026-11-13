/**
 * scenario.js — pagina Scenario
 * i numeri contano da zero quando entrano nello schermo (S5)
 */
document.addEventListener('DOMContentLoaded', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* --- 1. Numeri ---------------------------------------------------------- */
    const fmt = (el, v) => {
        const d = parseInt(el.dataset.decimals || '0', 10);
        el.textContent = (el.dataset.prefix || '') + v.toFixed(d) + (el.dataset.suffix || '');
    };
    const countUp = (el) => {
        const to = parseFloat(el.dataset.to);
        const t0 = performance.now();
        const dur = 1600;
        const step = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            fmt(el, to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const nums = document.querySelectorAll('.stat-num');
    if (!reduce && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (!en.isIntersecting) return;
                io.unobserve(en.target);
                countUp(en.target);
            });
        }, { threshold: 0.6 });
        nums.forEach(el => {
            // parte da zero solo se è ancora fuori schermo
            if (el.getBoundingClientRect().top > window.innerHeight) fmt(el, 0);
            io.observe(el);
        });
    }
});
