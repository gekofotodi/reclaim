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
        const mockupSrc = 'asset/immagini/Mockup_Manifesto.jpg';

        modalContent.classList.add('mockup-mode');
        container.innerHTML = `<img src="${mockupSrc}" class="manifesto-preview-img" alt="Manifesto Mockup">`;

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
