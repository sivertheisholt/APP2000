let hamburger = document.querySelector('.hamburger');
let menu = document.querySelector('.menu');
let bod = document.querySelector('.container');
let nav = document.querySelector('.lang');
let select = document.querySelectorAll('.select li');
let nor = document.getElementById('nor');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('isactive');
    menu.classList.toggle('active');
});



const handleClick = (e) => {
    select.forEach(node => {
      node.classList.remove('uk-active');
    });
    var lang = e.currentTarget.textContent;
    nav.textContent = lang;
    e.currentTarget.classList.add('uk-active');
  }
  
  select.forEach(node => {
    node.addEventListener('click', handleClick)
});
