/**
 * Manifesto Mockup Logic - Simplified
 */

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('manifesto-trigger');
    const label = document.getElementById('manifesto-label');
    const customCursor = document.getElementById('custom-cursor');
    const modal = document.getElementById('video-modal');
    const modalContent = document.querySelector('.video-modal-content');
    const container = document.getElementById('modal-iframe-container');

    if (!trigger || !label || !modal) return;

    // 1. Label Tracking & Visibility
    const toggleLabel = (show) => {
        if (modal.classList.contains('active')) {
            label.classList.remove('active');
            if (customCursor) customCursor.style.opacity = '1';
            return;
        }
        label.classList.toggle('active', show);
        if (customCursor) {
            customCursor.style.opacity = show ? '0' : '1';
        }
    };

    trigger.addEventListener('mousemove', (e) => {
        label.style.left = `${e.clientX}px`;
        label.style.top = `${e.clientY}px`;
    });

    trigger.addEventListener('mouseenter', () => toggleLabel(true));
    trigger.addEventListener('mouseleave', () => toggleLabel(false));

    // 2. Open Mockup
    trigger.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 768px)').matches) return; // su mobile: vista zoom (sotto)
        const mockupSrc = 'asset/web/mockup_manifesto-2800.webp';

        modalContent.classList.add('mockup-mode');
        container.innerHTML = `<img src="${mockupSrc}" class="manifesto-preview-img" alt="The Reclaim manifesto posted on a wall">`;

        modal.classList.add('active');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        toggleLabel(false);
    });

    // 3. Close Logic (Anywhere click)
    const closeModal = () => {
        if (!modal.classList.contains('active') || !modalContent.classList.contains('mockup-mode')) return;

        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';

        setTimeout(() => {
            modalContent.classList.remove('mockup-mode');
            container.innerHTML = '';
        }, 500);

        if (customCursor) customCursor.style.opacity = '1';
    };

    modal.addEventListener('click', closeModal);
});

/**
 * S4 — Mobile: un tocco apre il manifesto a tutto schermo su nero,
 * con zoom a due dita, trascinamento e doppio tocco per ingrandire.
 */
document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.getElementById('manifesto-trigger');
    if (!trigger || !window.matchMedia('(max-width: 768px)').matches) return;

    const src = 'asset/web/manifesto-1400.webp';
    const view = document.createElement('div');
    view.className = 'zoom-view';
    view.setAttribute('role', 'dialog');
    view.setAttribute('aria-modal', 'true');
    view.setAttribute('aria-label', 'Manifesto');
    view.innerHTML = `<button class="zoom-close" type="button">CLOSE [X]</button>
        <div class="zoom-stage"><img src="${src}" alt="Reclaim manifesto" draggable="false"></div>
        <p class="zoom-hint">PINCH TO ZOOM</p>`;
    document.body.appendChild(view);

    const img = view.querySelector('img');
    const stage = view.querySelector('.zoom-stage');
    let scale = 1, x = 0, y = 0;
    let start = null;

    const apply = () => { img.style.transform = `translate(${x}px, ${y}px) scale(${scale})`; };
    const clamp = () => {
        scale = Math.min(5, Math.max(1, scale));
        const mx = (img.offsetWidth * (scale - 1)) / 2;
        const my = (img.offsetHeight * (scale - 1)) / 2;
        x = Math.min(mx, Math.max(-mx, x));
        y = Math.min(my, Math.max(-my, y));
    };
    const reset = () => { scale = 1; x = 0; y = 0; apply(); };

    const open = () => {
        reset();
        view.classList.add('open');
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        view.querySelector('.zoom-close').focus({ preventScroll: true });
    };
    const close = () => {
        view.classList.remove('open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    };

    trigger.addEventListener('click', open);
    view.querySelector('.zoom-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && view.classList.contains('open')) close(); });

    const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    let lastTap = 0;

    stage.addEventListener('touchstart', (e) => {
        const t = e.touches;
        if (t.length === 2) {
            start = { d: dist(t), scale, x, y, cx: (t[0].clientX + t[1].clientX) / 2, cy: (t[0].clientY + t[1].clientY) / 2 };
        } else if (t.length === 1) {
            const now = Date.now();
            if (now - lastTap < 300) {               // doppio tocco: 2.5x o torna a 1x
                scale = scale > 1 ? 1 : 2.5; x = 0; y = 0; clamp(); apply();
                lastTap = 0; start = null; return;
            }
            lastTap = now;
            start = { px: t[0].clientX, py: t[0].clientY, x, y };
        }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
        if (!start) return;
        e.preventDefault();                          // qui lo zoom è nostro, non della pagina
        const t = e.touches;
        if (t.length === 2 && start.d) {
            scale = start.scale * dist(t) / start.d;
            const cx = (t[0].clientX + t[1].clientX) / 2;
            const cy = (t[0].clientY + t[1].clientY) / 2;
            x = start.x + (cx - start.cx);
            y = start.y + (cy - start.cy);
        } else if (t.length === 1 && start.px !== undefined && scale > 1) {
            x = start.x + (t[0].clientX - start.px);
            y = start.y + (t[0].clientY - start.py);
        }
        clamp(); apply();
    }, { passive: false });

    stage.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) start = null;
        else if (e.touches.length === 1) start = { px: e.touches[0].clientX, py: e.touches[0].clientY, x, y };
    }, { passive: true });
});
