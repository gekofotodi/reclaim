// Custom Cursor & Stamp Logic

document.addEventListener('DOMContentLoaded', () => {
    // I2: su touch il cursore non esiste, mai
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    // 1. Create Cursor Element
    const cursor = document.createElement('img');
    cursor.src = 'asset/loghi/logo.png'; // Loghi path
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    // 2. Hide Native Cursor & Move Custom Cursor
    document.body.style.cursor = 'none';

    // Ensure all clickable elements also hide cursor (optional, usually inherited)
    const style = document.createElement('style');
    style.innerHTML = `
        * { cursor: none !important; }
        #custom-cursor {
            position: fixed;
            top: -100px; /* Init off-screen */
            left: -100px; /* Init off-screen */
            width: 24px; /* Adjustable size */
            height: 24px;
            pointer-events: none;
            z-index: 10001;
            transform: translate(-50%, -50%); /* Center hotspot */
            transition: transform 0.05s linear; /* Slight smoothing */
            will-change: transform;
            /* Dynamic Contrast Logic */
            mix-blend-mode: difference;
            filter: invert(1); /* Invert black logo to white so 'difference' works correctly (White - Bg = Inverted Bg) */
        }

        /* Hide custom cursor when hovering special interactive zones to avoid overlaps */
        body:has(.video-wrapper:hover) #custom-cursor,
        body:has(.manifesto-wrapper:hover) #custom-cursor {
            opacity: 0 !important;
        }
        /* Restore default cursor when modal is open */
        body.modal-open, body.modal-open * {
            cursor: auto !important;
        }
        body.modal-open #custom-cursor {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // Mouse Move Handler
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // I timbri al click sono in site.js
});
