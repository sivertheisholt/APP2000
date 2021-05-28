var socket = io();
let hamburger = document.querySelector('.hamburger');
let menu = document.querySelector('.menu');
let langBtn = document.getElementById('choose-lang-btn');

/**
 * EventListener for å bytte mellom aktiv
 * @author Ørjan Dybevik - 233530
 */
hamburger.addEventListener('click', function(){
    hamburger.classList.toggle('isactive');
    menu.classList.toggle('active');
});

/**
 * EventListener for å endre ikon på språk knappen
 * @author Ørjan Dybevik - 233530
 */
langBtn.addEventListener('click', function(){
    if (langBtn.getAttribute('aria-expanded') != "true") {
        langBtn.querySelector('span').setAttribute('uk-icon', 'icon:  triangle-up');
    } else {
        langBtn.querySelector('span').setAttribute('uk-icon', 'icon:  triangle-down');
    }
});