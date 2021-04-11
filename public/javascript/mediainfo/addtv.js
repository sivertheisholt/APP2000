var socket = io.connect();
let tvFavoriteEle = document.getElementById('heart-tv-favorite');
let tvId = tvFavoriteEle.getAttribute('data-favorite-tvid');
let heartTvImg = document.getElementById('heart-tv-img');
let tvBookmarkEle = document.getElementById('bookmark-tv-watched');
let tvidWatched = tvBookmarkEle.getAttribute('data-watched-tvid');
let bookmarkTvImg = document.getElementById('bookmark-tv-img');

document.addEventListener('DOMContentLoaded', function () {
    if(isTvFav){
        heartTvImg.src = "/images/icons/heart-filled.png";
    } else {
        heartTvImg.src = '/images/icons/heart-border.png';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    if(isTvWatched){
        bookmarkTvImg.src = "/images/icons/bookmark-filled.png";
    } else {
        bookmarkTvImg.src = '/images/icons/bookmark-border.png';
    }
});

tvFavoriteEle.addEventListener("click", function(){
    if(isTvFav){
        socket.emit('delFavoriteTv', tvId);
    } else {
        socket.emit('addFavoriteTv', tvId);
    }
});

socket.on('favoritedTv', function(){
    location.reload();
});

socket.on('unfavoritedTv', function(){
    location.reload();
})

tvBookmarkEle.addEventListener("click", function(){
    if(isTvWatched){
        socket.emit('removeWatchedTv', tvId);
    } else {
        socket.emit('addWatchedTv', tvId);
    }
});

socket.on('tvAddedToWatchlist', function(){
    location.reload();
});

socket.on('tvRemovedFromWatchlist', function(){
    location.reload();
})