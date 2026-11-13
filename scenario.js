/**
 * scenario.js — pagina Scenario
 * 1. i numeri contano da zero quando entrano nello schermo (S5)
 * 2. DAO: la piramide si scioglie in una rete mentre si scorre (S5)
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

    /* --- 2. DAO ------------------------------------------------------------- */
    const dao = document.getElementById('dao');
    const svg = dao && dao.querySelector('.dao-svg');
    if (!svg) return;
    const NS = 'http://www.w3.org/2000/svg';

    // piramide: 1 in cima, 3, poi 9 cittadini in basso
    const A = [[300, 50],
        [160, 170], [300, 170], [440, 170],
        [70, 340], [130, 340], [190, 340], [250, 340], [310, 340], [370, 340], [430, 340], [490, 340], [550, 340]];
    // rete: gli stessi 13 nodi distribuiti, nessun vertice
    const B = [[300, 210],
        [170, 120], [420, 110], [470, 270],
        [80, 200], [120, 320], [220, 360], [330, 330], [250, 230], [380, 210], [540, 180], [520, 340], [280, 70]];
    const edgesA = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [1, 6], [2, 7], [2, 8], [2, 9], [3, 10], [3, 11], [3, 12]];
    const edgesB = [[0, 8], [0, 9], [0, 7], [0, 3], [1, 4], [1, 8], [1, 12], [2, 12], [2, 9], [2, 10], [3, 10], [3, 11],
        [3, 7], [4, 5], [4, 8], [5, 6], [5, 8], [6, 7], [7, 11], [9, 10], [8, 9], [1, 0], [12, 0], [6, 8]];

    const mk = (tag, attrs, parent) => {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        parent.appendChild(el);
        return el;
    };
    const gA = svg.querySelector('.dao-edges-a');
    const gB = svg.querySelector('.dao-edges-b');
    const gN = svg.querySelector('.dao-nodes');
    const linesA = edgesA.map(() => mk('line', { class: 'dao-edge' }, gA));
    const linesB = edgesB.map(() => mk('line', { class: 'dao-edge net' }, gB));
    const nodes = A.map((_, i) => mk('circle', { r: i === 0 ? 14 : 9, class: i === 0 ? 'dao-node top' : 'dao-node' }, gN));

    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const draw = (p) => {
        const e = ease(p);
        const pos = A.map((a, i) => [a[0] + (B[i][0] - a[0]) * e, a[1] + (B[i][1] - a[1]) * e]);
        nodes.forEach((n, i) => {
            n.setAttribute('cx', pos[i][0]);
            n.setAttribute('cy', pos[i][1]);
            // il vertice perde peso: diventa un nodo come gli altri
            if (i === 0) n.setAttribute('r', 14 - 5 * e);
        });
        const set = (lines, edges) => lines.forEach((l, k) => {
            const [a, b] = edges[k];
            l.setAttribute('x1', pos[a][0]); l.setAttribute('y1', pos[a][1]);
            l.setAttribute('x2', pos[b][0]); l.setAttribute('y2', pos[b][1]);
        });
        set(linesA, edgesA);
        set(linesB, edgesB);
        gA.style.opacity = 1 - e;
        gB.style.opacity = e;
        dao.style.setProperty('--p', e.toFixed(3));
        dao.classList.toggle('is-net', e > 0.5);
    };

    if (reduce) { draw(1); return; }

    const onScroll = () => {
        const r = dao.getBoundingClientRect();
        const total = dao.offsetHeight - window.innerHeight;
        const p = total > 0 ? Math.max(0, Math.min(1, (-r.top + window.innerHeight * 0.15) / total)) : 1;
        draw(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
});
