let hamburger = document.querySelector('.hamburger');
let menu = document.querySelector('.menu');

/**
 * EventListener for å bytte mellom aktiv
 */
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('isactive');
    menu.classList.toggle('active');
});


