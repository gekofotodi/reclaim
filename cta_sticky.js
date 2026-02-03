/**
 * sticky-cta.js
 * Handles the logic for stopping the fixed CTA button when it reaches the footer.
 * On Mobile: The CTA is fixed at bottom but should become relative/absolute when reaching footer to avoid overlap.
 * Or more commonly, it disappears or stops.
 *
 * User request: "shon now and download now buttons must behave like desktop version and stop when over the footer"
 * Desktop behavior: Usually `position: sticky` or handled by JS.
 * Here, `.cta-fixed` is `position: fixed` on mobile.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Only run on mobile (or consistent behavior if desired)
    // if (window.innerWidth > 768) return; 

    // Target the fixed CTA container
    const ctaContainer = document.querySelector('.cta-container.cta-fixed');
    const footer = document.querySelector('footer');

    if (!ctaContainer || !footer) return;

    // Check if we need to apply this logic (mostly for mobile where it is fixed)
    // if (getComputedStyle(ctaContainer).position !== 'fixed') return;

    // Scroll Handler
    const handleScroll = () => {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const ctaHeight = ctaContainer.offsetHeight;

        // Calculate if footer is visible in viewport
        // Footer top position relative to viewport
        const footerTop = footerRect.top;

        // Defines the point where CTA should stop. 
        // If fixed at bottom (bottom: 0), it occupies [viewportHeight - ctaHeight, viewportHeight]
        // We want it to stop so it sits ON TOP of the footer, or pushes up?
        // Usually "stop when over the footer" means it shouldn't cover the footer content.
        // Or it should dock to the top of the footer.

        // Mobile layout: Fixed at bottom.
        // If footer enters, the button should move up with the footer? 
        // OR stop being fixed and scroll away?
        // "bloccarsi quando arrivano sopra il footer" -> Stop/Dock at the footer top edge.

        // If footer is entering from bottom (footerTop < viewportHeight)
        // We want the CTA bottom to be at (footerTop).
        // Since CTA is fixed bottom: 0, its bottom is viewportHeight.

        // We can change position to absolute if it hits the footer?
        // Or simpler: Adjust 'bottom' property dynamically.

        if (footerTop < viewportHeight) {
            // Footer is effectively visible
            // Amount of footer visible:
            const overlap = viewportHeight - footerTop;

            // Move the fixed button UP by overlap amount? 
            // NO, `bloccarsi` means it stops moving relative to content?
            // "Stop when over the footer" -> It shouldn't scroll OVER the footer.
            // So if footer is present, the button should unstick?

            // Strategy:
            // Calculate absolute position relative to document.
            // If scroll position + viewport height > footer offset top
            // Then it should be absolute positioned at footer top - cta height.

            // Simpler JS approach for Fixed element docking:
            // Set `bottom` to `overlap` px.
            // If overlap > 0, bottom = overlap.

            // Wait, `footer` has padding?
            // If we set `bottom: ${overlap}px`, the CTA will ride ON TOP of the footer edge visually.
            // This makes it look like it's pushed by the footer.

            // Apply with !important to override CSS
            ctaContainer.style.setProperty('bottom', `${overlap}px`, 'important');
        } else {
            // Footer not visible, stick to bottom
            ctaContainer.style.setProperty('bottom', '0px', 'important');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
});
