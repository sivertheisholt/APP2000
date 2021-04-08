var socket = io.connect();
let movieEle = document.getElementById('heart-movie-favorite');
let movieid = movieEle.getAttribute('data-movieid');
let heartMovieImg = document.getElementById('heart-movie-img');

document.addEventListener('DOMContentLoaded', function () {
    if(isMovFav){
        heartMovieImg.src = "/images/icons/heart-filled.png";
    } else {
        heartMovieImg.src = '/images/icons/heart-border.png';
    }
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
