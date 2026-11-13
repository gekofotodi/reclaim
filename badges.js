// Attendi che il DOM sia caricato
document.addEventListener('DOMContentLoaded', () => {

    // Selezioniamo solo il wrapper dell'immagine
    // Ora questo wrapper è grande quanto la cella (flex: 1)
    const tiltElements = document.querySelectorAll(".badge-tilt-wrapper");

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 15,            // Inclinazione massima (meno è meglio se l'area è grande)
            speed: 1000,        // Velocità reazione aumentata per fluidità
            easing: "cubic-bezier(.03,.98,.52,.99)", // Easing personalizzato organico
            glare: true,        // Effetto luce
            "max-glare": 0.2,   // Luce più sottile
            scale: 1.05,        // Zoom leggero
            perspective: 1000,  // Profondità
            gyroscope: false,   // Disabilitato per alleggerire i calcoli
            reverse: true,
            // Questo parametro è importante: assicura che il calcolo
            // avvenga rispetto al box wrapper, che ora è grande come la cella
            "mouse-event-element": null
        });
    } else {
        console.warn("VanillaTilt not loaded. Check script include in badges.html");
    }
});

// S8 — Mobile: un tocco gira il badge (dietro: nome e missione), un secondo tocco lo rigira.
document.addEventListener('DOMContentLoaded', () => {
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    document.querySelectorAll('.catalog-item').forEach(item => {
        const front = item.querySelector('.badge-tilt-wrapper');
        const meta = item.querySelector('.item-meta');
        if (!front || !meta) return;

        const inner = document.createElement('div');
        inner.className = 'flip-inner';
        const back = document.createElement('div');
        back.className = 'badge-back';
        const [name, mission] = meta.querySelectorAll('span');
        back.innerHTML = `<span class="back-name">${name ? name.textContent : ''}</span>` +
            `<span class="back-mission">${mission ? mission.textContent : ''}</span>`;
        front.classList.add('badge-front');
        item.insertBefore(inner, front);
        inner.appendChild(front);
        inner.appendChild(back);
        item.classList.add('flippable');

        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-pressed', 'false');
        item.setAttribute('aria-label', `${name ? name.textContent : 'Badge'}: show mission`);

        const toggle = () => {
            const on = item.classList.toggle('flipped');
            item.setAttribute('aria-pressed', String(on));
        };
        item.addEventListener('click', toggle);
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
    });
});
