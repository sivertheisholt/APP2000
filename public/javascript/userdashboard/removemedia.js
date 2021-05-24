
/**
 * Fjerner en film eller serie fra favoritter.
 * @param {film/serie id} favId 
 * @param {movie/tv} type 
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530
 */
function removeMediaFav(favId, type){
    switch(type){
        case 'movie':
            socket.emit('unFavoriteMovie', favId.toString());
            document.getElementById(favId+'mov').innerHTML = "";
            document.getElementById(favId+'all').innerHTML = "";
            break;
        case 'tv':
            socket.emit('delFavoriteTv', favId.toString());
            document.getElementById(favId+'tv').innerHTML = "";
            document.getElementById(favId+'all').innerHTML = "";
            break;
        default:
            return;
    }
}

/**
 * Fjerner en film eller serie fra watchlist
 * @param {film/serie id} watchId
 * @param {movie/tv} type movie/tv 
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530
 */
function removeMediaWatched(watchId, type){
    switch(type){
        case 'movie':
            socket.emit('removeWatchedMovie', watchId.toString());
            document.getElementById(watchId+'mov').innerHTML = "";
            document.getElementById(watchId+'all').innerHTML = "";
            break;
        case 'tv':
            socket.emit('removeWatchedTv', watchId.toString());
            document.getElementById(watchId+'tv').innerHTML = "";
            document.getElementById(watchId+'all').innerHTML = "";
            break;
        default:
            return;
    }
}