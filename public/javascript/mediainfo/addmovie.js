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
});

document.addEventListener('DOMContentLoaded', function () {
    if(isMovWatched){
        bookmarkMovieImg.src = "/images/icons/bookmark-filled.png";
    } else {
        bookmarkMovieImg.src = '/images/icons/bookmark-border.png';
    }
});

movieEleFav.addEventListener("click", function(){
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

movieEleBookmark.addEventListener("click", function(){
    if(isMovWatched){
        socket.emit('removeWatchedMovie', movieid);
    } else {
        socket.emit('addWatchedMovie', movieid);
    }
}); 

socket.on('movieAddedToWatchlist', function(){
    location.reload();
});

socket.on('movieRemovedFromWatchlist', function(){
    location.reload();
})