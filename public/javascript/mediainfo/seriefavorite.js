var socket = io.connect();
let serieEle = document.getElementById('heart-tv-favorite');
let tvId = serieEle.getAttribute('data-tvid');
let heartTvImg = document.getElementById('heart-tv-img');
console.log(isTvFav);

document.addEventListener('DOMContentLoaded', function () {
    if(isTvFav){
        heartTvImg.src = "/images/icons/heart-filled.png";
    } else {
        heartTvImg.src = '/images/icons/heart-border.png';
    }
});

serieEle.addEventListener("click", function(){
    if(isTvFav){
        socket.emit('unfavoriteTv', tvId);
    } else {
        socket.emit('favoriteTv', tvId);
    }
});

socket.on('favoritedTv', function(){
    location.reload();
});

socket.on('unfavoritedTv', function(){
    location.reload();
})