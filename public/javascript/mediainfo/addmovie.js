var socket = io.connect();
let movieEleFav = document.getElementById('heart-movie-favorite');
let movieid = movieEleFav.getAttribute('data-favorite-movieid');
let heartMovieImg = document.getElementById('heart-movie-img');
let movieEleBookmark = document.getElementById('bookmark-movie-watched');
let movieidWatched = movieEleBookmark.getAttribute('data-watched-movieid');
let bookmarkMovieImg = document.getElementById('bookmark-movie-img');

let filminfoUserList = document.getElementById('filminfo-options-lists');
let filminfoListSelectbox = document.getElementById('filminfo-user-list');
let filminfoListMovieId = filminfoListSelectbox.getAttribute('data-list-movieid');
let filminfoListSaveBtn = document.getElementById('save-to-list-btn');
let filminfoListResult = document.getElementById('listAddedResult');
let filminfoListCancelBtn = document.getElementById('cancel-list-btn');

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

filminfoListSaveBtn.addEventListener("click", function(){
    filminfoUserList.style.display = 'none';
    let selectedList = filminfoListSelectbox.options[filminfoListSelectbox.selectedIndex].getAttribute('data-list-id');
    if(selectedList !== null){
        socket.emit('addMovieToList', {movieid: filminfoListMovieId, listid: selectedList});
    } else {
        console.log("Select a list");
    }
}); 

socket.on('displayMovieList', function(result){
    filminfoListResult.innerHTML = result.information;
});