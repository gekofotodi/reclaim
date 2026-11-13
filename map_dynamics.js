/**
 * Mappa delle città attive (I7)
 * Ogni nodo: cittadini (cambiano dal vivo), ora locale, data di attivazione.
 * Desktop: mondo, dati al passaggio del mouse. Mobile: ritaglio sull'Europa + elenco toccabile.
 * Le posizioni europee sono leggermente distanziate per restare leggibili sulla mappa del mondo.
 */
document.addEventListener('DOMContentLoaded', () => {
    const CITIES = [
        { id: 'bcn', city: 'BARCELONA', lat: 41.39, lon: 2.17, top: 40.2, left: 47.2, citizens: 1204, tz: 'Europe/Madrid', since: '06.07.2025', origin: true },
        { id: 'milan', city: 'MILAN', lat: 45.46, lon: 9.19, top: 37.0, left: 48.9, citizens: 420, tz: 'Europe/Rome', since: '14.10.2025' },
        { id: 'venice', city: 'VENICE', lat: 45.44, lon: 12.33, top: 36.6, left: 50.6, citizens: 388, tz: 'Europe/Rome', since: '02.11.2025' },
        { id: 'florence', city: 'FLORENCE', lat: 43.77, lon: 11.25, top: 39.4, left: 49.9, citizens: 276, tz: 'Europe/Rome', since: '21.12.2025' },
        { id: 'london', city: 'LONDON', lat: 51.51, lon: -0.13, top: 34.0, left: 46.6, citizens: 512, tz: 'Europe/London', since: '30.01.2026' },
        { id: 'nyc', city: 'NEW YORK', lat: 40.71, lon: -74.0, top: 38, left: 30, citizens: 600, tz: 'America/New_York', since: '03.03.2026' },
        { id: 'tokyo', city: 'TOKYO', lat: 35.68, lon: 139.76, top: 43, left: 80, citizens: 850, tz: 'Asia/Tokyo', since: '18.04.2026' },
        { id: 'nairobi', city: 'NAIROBI', lat: -1.29, lon: 36.82, top: 62, left: 56, citizens: 315, tz: 'Africa/Nairobi', since: '09.06.2026' },
        { id: 'ba', city: 'BUENOS AIRES', lat: -34.6, lon: -58.38, top: 78, left: 33, citizens: 290, tz: 'America/Argentina/Buenos_Aires', since: '27.08.2026' }
    ];

    const inner = document.querySelector('.map-inner');
    const list = document.querySelector('.city-list');
    if (!inner) return;

    const time = (tz) => new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
    const fmt = (n) => n.toLocaleString('en-US');

    // nodi e righe dell'elenco
    CITIES.forEach(c => {
        const m = document.createElement('div');
        m.className = 'map-marker' + (c.origin ? ' is-origin' : '');
        m.id = 'marker-' + c.id;
        m.style.top = c.top + '%';
        m.style.left = c.left + '%';
        m.innerHTML = '<div class="map-marker-icon"></div>';
        inner.appendChild(m);
        c.marker = m;

        if (list) {
            const li = document.createElement('li');
            li.innerHTML = `<button type="button" class="city-row" aria-expanded="false">
                    <span class="city-name">${c.city}${c.origin ? ' <em>ORIGIN</em>' : ''}</span>
                    <span class="city-count"></span>
                </button>
                <div class="city-detail" hidden></div>`;
            list.appendChild(li);
            c.row = li;
        }
    });

    const update = (first) => {
        CITIES.forEach(c => {
            if (!first && Math.random() > 0.7) c.citizens = Math.max(0, c.citizens + Math.floor(Math.random() * 11) - 5);
            const t = time(c.tz);
            c.marker.dataset.tooltip =
                `CITY: ${c.city}${c.origin ? ' (ORIGIN)' : ''}\nCITIZENS: ${fmt(c.citizens)}\nLOCAL TIME: ${t}\nACTIVE SINCE: ${c.since}`;
            if (c.row) {
                c.row.querySelector('.city-count').textContent = fmt(c.citizens);
                c.row.querySelector('.city-detail').textContent =
                    `LOCAL TIME ${t} · ACTIVE SINCE ${c.since} · ${c.lat}, ${c.lon}`;
            }
        });
    };
    update(true);
    setInterval(update, 2000);

    // mobile: tocco su un nodo o su una riga
    const markers = CITIES.map(c => c.marker);
    const select = (c) => {
        const open = !c.marker.classList.contains('active');
        CITIES.forEach(o => {
            o.marker.classList.remove('active');
            if (o.row) {
                o.row.classList.remove('open');
                o.row.querySelector('.city-row').setAttribute('aria-expanded', 'false');
                o.row.querySelector('.city-detail').hidden = true;
            }
        });
        if (!open) return;
        c.marker.classList.add('active');
        if (c.row) {
            c.row.classList.add('open');
            c.row.querySelector('.city-row').setAttribute('aria-expanded', 'true');
            c.row.querySelector('.city-detail').hidden = false;
        }
    };

    CITIES.forEach(c => {
        if (c.row) c.row.querySelector('.city-row').addEventListener('click', () => select(c));
        c.marker.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;
            e.stopPropagation();
            select(c);
        });
    });
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 768 || e.target.closest('.city-list, .map-marker')) return;
        markers.forEach(m => m.classList.remove('active'));
    });
});
