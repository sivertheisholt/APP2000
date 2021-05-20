var socket = io.connect();
let tvFavoriteEle = document.getElementById('heart-tv-favorite');
let tvId = tvFavoriteEle.getAttribute('data-favorite-tvid');
let heartTvImg = document.getElementById('heart-tv-img');
let tvBookmarkEle = document.getElementById('bookmark-tv-watched');
let tvidWatched = tvBookmarkEle.getAttribute('data-watched-tvid');
let bookmarkTvImg = document.getElementById('bookmark-tv-img');

let serieinfoUserList = document.getElementById('serieinfo-options-lists');
let serieinfoListSelectbox = document.getElementById('serieinfo-user-list');
let serieinfoListTvId = serieinfoListSelectbox.getAttribute('data-list-tvid');
let serieinfoListSaveBtn = document.getElementById('save-to-list-btn');
let serieinfoListResult = document.getElementById('listAddedResult');
let serieinfoListCancelBtn = document.getElementById('cancel-list-btn');

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

serieinfoListSaveBtn.addEventListener("click", function(){
    serieinfoUserList.style.display = 'none';
    let selectedList = serieinfoListSelectbox.options[serieinfoListSelectbox.selectedIndex].getAttribute('data-list-id');
    if(selectedList !== null){
        socket.emit('addTvToList', {tvid: serieinfoListTvId, listid: selectedList});
    } else {
        console.log("Select a list");
    }
}); 

socket.on('displayMovieList', function(result){
    serieinfoListResult.innerHTML = result.information;
});