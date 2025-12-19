// Detect scrolling to toggle scrollbar visibility
let isScrolling;
window.addEventListener('scroll', () => {
    document.body.classList.add('is-scrolling');
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
    }, 1000); // Disappear after 1 second of no scroll
});
