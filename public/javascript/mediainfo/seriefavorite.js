var socket = io.connect();
let serieEle = document.getElementById('heart-tv-favorite');
let tvId = serieEle.getAttribute('data-tvid');

console.log(isTvFav);

document.addEventListener('DOMContentLoaded', function () {
    if(isTvFav){
        serieEle.style.backgroundColor = 'blue';
    } else {
        serieEle.style.backgroundColor = 'transparent';
    }
});

socket.on('connect', function () {
    console.log('Connected to the server.')
});

socket.on('disconnect', function () {
    console.log('Disconnected to the server.')
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