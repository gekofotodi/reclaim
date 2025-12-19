document.addEventListener('DOMContentLoaded', () => {

    // 1. IP / Coordinates
    const ipElement = document.getElementById('info-ip');
    if (ipElement) {
        // Attempt to fetch user's location/IP
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                // Format: LAT: 12.3456 LONG: 98.7654 (IP: 1.2.3.4)
                const lat = data.latitude || '0.0000';
                const lon = data.longitude || '0.0000';
                ipElement.textContent = `${lat}, ${lon}`;
                ipElement.title = ""; // Remove native tooltip
                ipElement.dataset.tooltip = `IP: ${data.ip} | Region: ${data.region_code}`;
            })
            .catch(() => {
                // Fallback if blocked
                ipElement.textContent = "45.4642, 9.1900"; // Generic (Milan) or randomize
                ipElement.dataset.tooltip = "IP: Hidden | Region: Milan_Node";
            });
    }

    // 2. Counter
    // 2. Counter
    const counterElement = document.getElementById('info-counter');
    if (counterElement) {
        counterElement.dataset.tooltip = "NUMBER OF TURIST\nHUNTED SINCE\n01-01-2027 UNTIL\nTODAY";

        // Load persist count or default
        let count = parseInt(localStorage.getItem('reclaim_counter')) || 10000;

        let lastValueStr = "";

        const updateDisplay = () => {
            const valStr = count.toLocaleString('en-US');

            // First run or length mismatch: just render text
            if (!lastValueStr || lastValueStr.length !== valStr.length) {
                counterElement.innerHTML = valStr;
                lastValueStr = valStr;
                return;
            }

            counterElement.innerHTML = '';

            for (let i = 0; i < valStr.length; i++) {
                const charNew = valStr[i];
                const charOld = lastValueStr[i];

                if (charNew === charOld) {
                    const span = document.createElement('span');
                    span.textContent = charNew;
                    counterElement.appendChild(span);
                } else {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'digit-wrapper';

                    const slider = document.createElement('span');
                    slider.className = 'digit-slider';

                    // Structure: Old on top, New on bottom
                    slider.innerHTML = `<span class="digit-char">${charOld}</span><span class="digit-char">${charNew}</span>`;

                    wrapper.appendChild(slider);
                    counterElement.appendChild(wrapper);

                    // Trigger Animation
                    // Force reflow to ensure start position is 0
                    void slider.offsetWidth;

                    // Animate to show new digit (slide up)
                    slider.style.transform = 'translateY(-1.2em)';
                }
            }
            lastValueStr = valStr;
        };
        updateDisplay();

        // Irregular increment loop
        const scheduleNextUpdate = () => {
            const delay = Math.random() * 2000 + 500; // Random delay between 500ms and 2500ms
            setTimeout(() => {
                const increment = Math.floor(Math.random() * 3) + 1; // Increment by 1-3
                count += increment;
                localStorage.setItem('reclaim_counter', count);

                // Update Slot Animation
                updateDisplay();

                scheduleNextUpdate();
            }, delay);
        };

        scheduleNextUpdate();
    }

    // 3. Time
    const timeElement = document.getElementById('info-time');
    if (timeElement) {
        timeElement.dataset.tooltip = `ZONE: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
        const updateTime = () => {
            const now = new Date();
            // Future Date (+10 years)
            const futureDate = new Date(now);
            futureDate.setFullYear(2027);

            // Format: YYYY-MM-DD HH:MM:SS
            // const timeString = now.toISOString().replace('T', ' ').split('.')[0]; 
            // Better formatted local time
            const dateStr = futureDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
            const timeStr = futureDate.toLocaleTimeString('en-GB'); // HH:MM:SS
            timeElement.textContent = `${dateStr} ${timeStr}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }
});

// Helper to ensure caps if needed dynamically, but hardcoded strings are fine.
// The user requested "tutte le scritte in cofo in caps lock". Assuming 'cofo' means 'info' (typo).
// The CSS text-transform: uppercase might handle visual representation, but let's check styles.
// .info-item is uppercase. .info-item::after (tooltip) had text-transform: none in style.css.
window.addEventListener('load', () => {
    // Force uppercase via JS just in case for dynamic content if CSS doesn't cover it
    const tips = document.querySelectorAll('[data-tooltip]');
    tips.forEach(t => {
        if (t.dataset.tooltip) t.dataset.tooltip = t.dataset.tooltip.toUpperCase();
    });
});
