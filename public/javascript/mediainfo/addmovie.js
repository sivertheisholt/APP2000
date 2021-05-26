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

/**
 * Eventlistener for hele dokumentet som sjekker om brukeren har filmen som favoritt/watchlist eller ikke
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Eventlistener for hjerteikonet, legger til favoritt eller fjerner som favoritt
 * @author Ørjan Dybevik - 233530
 */
if(isLoggedIn){
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
}


/**
 * Eventlistener for bookmarkikonet, legger til i watchlist eller fjerner fra watchlist
 * @author Ørjan Dybevik - 233530
 */
if(isLoggedIn){
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
}


/**
 * Eventlistener for å legge til i en liste, legger film til i valgt liste
 * @author Ørjan Dybevik - 233530
 */
if(isLoggedIn){
    filminfoListSaveBtn.addEventListener("click", function(){
        filminfoUserList.style.display = 'none';
        let selectedList = filminfoListSelectbox.options[filminfoListSelectbox.selectedIndex].getAttribute('data-list-id');
        if(selectedList !== null){
            socket.emit('addMovieToList', {movieid: filminfoListMovieId, listid: selectedList});
        } else {
            filminfoListResult.innerHTML = 'Select a list';
        }
    }); 
}


/**
 * Tilbakemelding fra socket om den blir lagt til i liste eller ikke
 * @author Ørjan Dybevik - 233530
 */
socket.on('displayMovieList', async function(result){
    UIkit.modal(document.getElementById('add-list-modal')).hide();
    if(!result.status){
        swal("Woops!", "This movie is already in your list", "error");
        return;
    }
    swal("Nice!", "This movie has been added to your list!", "success");
});