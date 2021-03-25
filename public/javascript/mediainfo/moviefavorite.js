var socket = io.connect();
let movieEle = document.getElementById('heart-movie-favorite');
let movieid = movieEle.getAttribute('data-movieid');

console.log(isMovFav);

document.addEventListener('DOMContentLoaded', function () {
    if(isMovFav){
        movieEle.style.backgroundColor = 'blue';
    } else {
        movieEle.style.backgroundColor = 'transparent';
    }
}); 

socket.on('connect', function () {
    console.log('Connected to the server.')
});

socket.on('disconnect', function () {
    console.log('Disconnected to the server.')
}); 

movieEle.addEventListener("click", function(){
    if(isMovFav){
        socket.emit('unFavoriteMovie', movieid);
    } else {
        socket.emit('favoriteMovie', movieid);
    }
});  

socket.on('favoritedMovie', function(){
    location.reload();
});

socket.on('unfavoritedMovie', function(){
    location.reload();
})
