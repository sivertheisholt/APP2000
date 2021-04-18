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
    if(isTvWatched){
        bookmarkTvImg.src = "/images/icons/bookmark-filled.png";
    } else {
        bookmarkTvImg.src = '/images/icons/bookmark-border.png';
    }
});

tvFavoriteEle.addEventListener("click", function(){
    if(isTvFav){
        isTvFav = false;
        heartTvImg.src = '/images/icons/heart-border.png';
        socket.emit('delFavoriteTv', tvId);
    } else {
        isTvFav = true;
        heartTvImg.src = "/images/icons/heart-filled.png";
        socket.emit('addFavoriteTv', tvId);
    }
});

tvBookmarkEle.addEventListener("click", function(){
    if(isTvWatched){
        isTvWatched = false;
        bookmarkTvImg.src = '/images/icons/bookmark-border.png';
        socket.emit('removeWatchedTv', tvId);
    } else {
        isTvFav = true;
        bookmarkTvImg.src = "/images/icons/bookmark-filled.png";
        socket.emit('addWatchedTv', tvId);
    }
});