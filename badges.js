// Attendi che il DOM sia caricato
document.addEventListener('DOMContentLoaded', () => {

    // Selezioniamo solo il wrapper dell'immagine
    // Ora questo wrapper è grande quanto la cella (flex: 1)
    const tiltElements = document.querySelectorAll(".badge-tilt-wrapper");

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(tiltElements, {
            max: 15,            // Inclinazione massima (meno è meglio se l'area è grande)
            speed: 400,         // Velocità reazione
            glare: true,        // Effetto luce
            "max-glare": 0.2,   // Luce più sottile
            scale: 1.05,        // Zoom leggero
            perspective: 1000,  // Profondità
            gyroscope: true,
            reverse: true,
            // Questo parametro è importante: assicura che il calcolo
            // avvenga rispetto al box wrapper, che ora è grande come la cella
            "mouse-event-element": null
        });
    } else {
        console.warn("VanillaTilt not loaded. Check script include in badges.html");
    }
});
