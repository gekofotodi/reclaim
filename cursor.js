// Custom Cursor & Stamp Logic

document.addEventListener('DOMContentLoaded', () => {
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
            width: 32px; /* Adjustable size */
            height: 32px;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%); /* Center hotspot */
            transition: transform 0.05s linear; /* Slight smoothing */
            will-change: transform;
            /* Dynamic Contrast Logic */
            mix-blend-mode: difference;
            filter: invert(1); /* Invert black logo to white so 'difference' works correctly (White - Bg = Inverted Bg) */
        }
        .cursor-stamp {
            position: absolute;
            width: 32px;
            height: 32px;
            pointer-events: none;
            z-index: 1; /* Below cursor, above content */
            transform: translate(-50%, -50%) scale(0);
            animation: stampPop 0.3s forwards;
            
            /* Orange logo used directly */
            mix-blend-mode: normal;
        }

        @keyframes stampPop {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Mouse Move Handler
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 3. Stamp Logic
    document.addEventListener('click', (e) => {
        // Prevent stamp on structural/interactive elements and footers
        if (e.target.closest('button, a, input, .hamburger-menu, .nav-links-mobile, footer, .checkout-footer, .info-bar, .news-ticker-bar, .main-navbar')) return;


        const stamp = document.createElement('img');
        stamp.src = 'asset/immagini/logo_orange.png'; // Loghi path
        stamp.classList.add('cursor-stamp');


        // Position relative to document (handle scroll)
        stamp.style.left = e.pageX + 'px';
        stamp.style.top = e.pageY + 'px';

        document.body.appendChild(stamp);

        // Optional: Remove stamps after animation or some time if too many?
        // keeping permanent as per previous implementation implicit behavior
    });
});
