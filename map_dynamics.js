// Map Marker Dynamics
document.addEventListener('DOMContentLoaded', () => {

    const markers = [
        { id: 'marker-milan', city: 'MILAN', lat: 45.46, lon: 9.19, baseSoldiers: 420, tz: 'Europe/Rome' },
        { id: 'marker-tokyo', city: 'TOKYO', lat: 35.68, lon: 139.76, baseSoldiers: 850, tz: 'Asia/Tokyo' },
        { id: 'marker-nairobi', city: 'NAIROBI', lat: -1.29, lon: 36.82, baseSoldiers: 315, tz: 'Africa/Nairobi' },
        { id: 'marker-nyc', city: 'NEW YORK', lat: 40.71, lon: -74.00, baseSoldiers: 600, tz: 'America/New_York' },
        { id: 'marker-ba', city: 'BUENOS AIRES', lat: -34.60, lon: -58.38, baseSoldiers: 290, tz: 'America/Argentina/Buenos_Aires' }
    ];

    function updateMarkers() {
        markers.forEach(data => {
            const el = document.getElementById(data.id);
            if (!el) return;

            // Update Soldiers: random flux +/- 5
            let currentSoldiers = parseInt(el.dataset.soldiers || data.baseSoldiers);

            // Randomly update sometimes
            if (Math.random() > 0.7) {
                const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
                currentSoldiers = Math.max(0, currentSoldiers + change);
                el.dataset.soldiers = currentSoldiers;
            }

            // Update Time
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-GB', { timeZone: data.tz, hour: '2-digit', minute: '2-digit' });

            // Get Timezone abbreviation (simplified logic or hardcoded)
            // Just displaying local time is enough as per request "orario e fuso"
            // We can append zone code if needed, but standard locale string is clean.

            const tooltipText = `COORD: ${data.lat}, ${data.lon}
TIME: ${timeStr}
CITY: ${data.city}
SOLDIERS: ${currentSoldiers}`;

            el.dataset.tooltip = tooltipText; // CSS handles the display via attr() but dynamic attributes in attr content might not auto-refresh in all browsers efficiently or if content style is static. 
            // Actually CSS content: attr(data-tooltip) IS dynamic.
        });
    }

    // Init constraints
    markers.forEach(d => {
        const el = document.getElementById(d.id);
        if (el) el.dataset.soldiers = d.baseSoldiers;
    });

    setInterval(updateMarkers, 2000); // Update every 2 seconds
    updateMarkers();
});
