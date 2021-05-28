let accountBtn = document.getElementById('account-btn');

/**
 * EventListener for å endre ikon på konto knappen
 * @author Ørjan Dybevik - 233530
 */
 accountBtn.addEventListener('mouseenter', function(){
    accountBtn.querySelector('span').setAttribute('uk-icon', 'icon:  triangle-up');
});

/**
 * EventListener for å endre ikon på konto knappen
 * @author Ørjan Dybevik - 233530
 */
 accountBtn.addEventListener('mouseleave', function(){
    accountBtn.querySelector('span').setAttribute('uk-icon', 'icon:  triangle-down');
});