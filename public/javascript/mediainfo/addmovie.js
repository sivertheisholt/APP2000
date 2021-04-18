var socket = io.connect();
let movieEleFav = document.getElementById('heart-movie-favorite');
let movieid = movieEleFav.getAttribute('data-favorite-movieid');
let heartMovieImg = document.getElementById('heart-movie-img');
let movieEleBookmark = document.getElementById('bookmark-movie-watched');
let movieidWatched = movieEleBookmark.getAttribute('data-watched-movieid');
let bookmarkMovieImg = document.getElementById('bookmark-movie-img');


document.addEventListener('DOMContentLoaded', function () {
    if(isMovFav){
        heartMovieImg.src = "/images/icons/heart-filled.png";
    } else {
        heartMovieImg.src = '/images/icons/heart-border.png';
    }
    if(isMovWatched){
        bookmarkMovieImg.src = "/images/icons/bookmark-filled.png";
    } else {
        bookmarkMovieImg.src = '/images/icons/bookmark-border.png';
    }
});

movieEleFav.addEventListener("click", function(){
    if(isMovFav){
        isMovFav = false;
        heartMovieImg.src = '/images/icons/heart-border.png';
        socket.emit('unFavoriteMovie', movieid);
    } else {
        isMovFav = true;
        heartMovieImg.src = "/images/icons/heart-filled.png";
        socket.emit('favoriteMovie', movieid);
    }
});

movieEleBookmark.addEventListener("click", function(){
    if(isMovWatched){
        isMovWatched = false;
        bookmarkMovieImg.src = '/images/icons/bookmark-border.png';
        socket.emit('removeWatchedMovie', movieid);
    } else {
        isMovWatched = true;
        bookmarkMovieImg.src = "/images/icons/bookmark-filled.png";
        socket.emit('addWatchedMovie', movieid);
    }
}); 