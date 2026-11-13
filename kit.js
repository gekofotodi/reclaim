/**
 * kit.js — pagina Kit
 * 1. la scatola si apre allo scroll: le etichette (desktop) o i cerchi numerati (mobile) compaiono uno alla volta
 * 2. la ReclaimX: i sei pezzi compaiono uno alla volta quando entra nello schermo
 * 3. tocco su un cerchio: scheda dal basso con nome, foto e una riga di descrizione
 */
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    /* --- Dati delle schede ------------------------------------------------- */
    const card = (f) => ({ src: `asset/web/card_${f}-500.webp` });
    const part = (x, y) => ({ src: 'asset/web/reclaimx_parts-900.webp', zoom: { x, y } });
    const ITEMS = {
        // scatola: stessi testi delle schede
        stencil: { name: 'STENCIL', desc: 'DURABLE, LASER-CUT STENCIL FOR RAPID RECLAIM IDENTIFICATION.', ...card('stencil') },
        reclaimx: { name: 'RECLAIMX', desc: 'YOUR OWN PAINTBALL GUN TO STOP TOURIST INVASION AND RECLAIM YOUR CITY.', ...card('arma') },
        ammunitions: { name: 'AMMUNITIONS', desc: 'PREMIUM PAINTBALL AMMUNITIONS FOR MAXIMUM PERFORMANCE.', ...card('ammonitions') },
        spray: { name: 'SPRAY CAN', desc: 'HIGH-PRESSURE MARKING TOOL FOR FAST AND PRECISE DEPLOYMENT.', ...card('spray') },
        brochure: { name: 'BROCHURE', desc: 'A GUIDE TO THE TECHNICAL OPERATION OF OUR GUN.', ...card('brochure') },
        badge: { name: 'BEGINNER BADGE', desc: 'MAGNETIC BADGE TO BE PLACED ON THE SIDE OF YOUR GUN USING MAGNETIC MOUNT.', ...card('badge') },
        // ReclaimX: i sei pezzi (booklet)
        mount: { name: '01 MAGNETIC PHONE MOUNT', desc: 'YOUR PHONE CLIPS ON HERE: THE APP IS YOUR SCOPE.', ...part(85.3, 49.6) },
        ammo: { name: '02 AMMUNITIONS', desc: 'THE PAINTBALL CARTRIDGES SIT IN THE SIDE OF THE GUN.', ...part(45.9, 34.4) },
        wbadge: { name: '03 WELCOME BADGE', desc: 'YOUR FIRST RANK. MAGNETIC: SWAP IT AS YOU EARN NEW BADGES.', ...part(31.2, 46.6) },
        trigger: { name: '04 TRIGGER', desc: 'SHOOTS, TAKES A PHOTO THROUGH THE APP AND VIBRATES FOR 2 SECONDS.', ...part(37.1, 70.6) },
        grip: { name: '05 GRIP', desc: 'RUBBER GRIP FOR A STEADY AIM.', ...part(47.1, 82.4) },
        handles: { name: '06 HANDLES', desc: 'TWO OPENINGS TO HOLD THE RECLAIMX WITH BOTH HANDS.', ...part(14.7, 68.7) }
    };

    /* --- Scheda ------------------------------------------------------------- */
    const sheet = document.getElementById('sheet');
    const backdrop = document.getElementById('sheet-backdrop');
    const photo = document.getElementById('sheet-photo');
    let lastTrigger = null;

    const openSheet = (key, trigger) => {
        const it = ITEMS[key];
        if (!it || !sheet) return;
        lastTrigger = trigger;
        document.getElementById('sheet-name').textContent = it.name;
        document.getElementById('sheet-desc').textContent = it.desc;
        if (it.zoom) {
            // dettaglio del pezzo: la foto della ReclaimX ingrandita su quel punto
            photo.className = 'sheet-photo is-zoom';
            photo.innerHTML = '';
            photo.style.backgroundImage = `url(${it.src})`;
            photo.style.backgroundPosition = `${it.zoom.x}% ${it.zoom.y}%`;
        } else {
            photo.className = 'sheet-photo';
            photo.style.backgroundImage = '';
            photo.innerHTML = `<img src="${it.src}" alt="">`;
        }
        sheet.hidden = false;
        backdrop.hidden = false;
        requestAnimationFrame(() => {
            sheet.classList.add('open');
            backdrop.classList.add('open');
        });
        document.body.classList.add('sheet-open');
        document.getElementById('sheet-close').focus({ preventScroll: true });
    };

    const closeSheet = () => {
        if (!sheet || sheet.hidden) return;
        sheet.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.classList.remove('sheet-open');
        setTimeout(() => { sheet.hidden = true; backdrop.hidden = true; }, 300);
        if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    };

    document.querySelectorAll('.hotspot').forEach(h => {
        h.addEventListener('click', (e) => { e.stopPropagation(); openSheet(h.dataset.item, h); });
    });
    if (backdrop) backdrop.addEventListener('click', closeSheet);
    const closeBtn = document.getElementById('sheet-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

    /* --- ReclaimX: i pezzi entrano uno alla volta -------------------------- */
    const gun = document.querySelector('.gun-figure');
    if (gun && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) return;
            gun.classList.add('show');
            io.disconnect();
        }, { threshold: 0.45 });
        io.observe(gun);
    } else if (gun) {
        gun.classList.add('show');
    }

    /* --- Scatola che si apre allo scroll ---------------------------------- */
    const scrollContainer = document.getElementById('kit-scroll-container');
    const layerClosed = document.getElementById('layer-closed');
    const paths = document.querySelectorAll('.kit-path');
    const labelGroups = document.querySelectorAll('.kit-label-group');
    const boxSpots = document.querySelectorAll('.hotspots[data-group="box"] .hotspot');
    if (!scrollContainer || !layerClosed) return;

    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    });

    // ordinati dall'alto in basso, per disegnarli in sequenza
    const elements = Array.from(paths).map((path, index) => {
        const group = labelGroups[index];
        const y = parseFloat(group.querySelector('text').getAttribute('y'));
        return { path, group, y, length: path.getTotalLength() };
    }).sort((a, b) => a.y - b.y);

    const onScroll = () => {
        const rect = scrollContainer.getBoundingClientRect();
        let progress = -rect.top / (scrollContainer.offsetHeight - window.innerHeight);
        progress = Math.max(0, Math.min(1, progress));

        // 1. la scatola chiusa sale (10% → 40%)
        if (progress < 0.1) {
            layerClosed.style.transform = 'translate(-50%, -50%)';
            layerClosed.style.visibility = 'visible';
        } else if (progress <= 0.4) {
            const ySlide = -50 - easeInOutCubic((progress - 0.1) / 0.3) * 100;
            layerClosed.style.transform = `translate(-50%, ${ySlide}%)`;
            layerClosed.style.visibility = 'visible';
        } else {
            layerClosed.style.transform = 'translate(-50%, -150%)';
            layerClosed.style.visibility = 'hidden';
        }

        // 2. pausa (40% → 50%), poi etichette o cerchi uno alla volta (50% → 95%)
        const phase2 = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.45) : 0;

        if (isMobile) {
            boxSpots.forEach((h, i) => h.classList.toggle('show', phase2 > (i / boxSpots.length) * 0.85 + 0.02));
            return;
        }

        elements.forEach((item, index) => {
            const itemStart = (index / elements.length) * 0.75;
            const itemEnd = Math.min(1, itemStart + 0.25);
            const p = phase2 === 0 ? 0 : Math.max(0, Math.min(1, (phase2 - itemStart) / (itemEnd - itemStart)));
            item.path.style.strokeDashoffset = item.length * (1 - easeInOutCubic(p));
            item.group.classList.toggle('visible', p >= 1);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
