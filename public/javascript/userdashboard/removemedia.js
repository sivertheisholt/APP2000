
/**
 * Fjerner en film eller serie fra favoritter.
 * @param {film/serie id} favId 
 * @param {movie/tv} type 
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530
 */
function removeMediaFav(favId, type, e){
    e.preventDefault();
    switch(type){
        case 'movie':
            socket.emit('unFavoriteMovie', favId.toString());
            document.getElementById(favId+'movfav').remove();
            document.getElementById(favId+'allfav').remove();
            break;
        case 'tv':
            socket.emit('delFavoriteTv', favId.toString());
            document.getElementById(favId+'tvfav').remove();
            document.getElementById(favId+'allfav').remove();
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
function removeMediaWatched(watchId, type, e){
    e.preventDefault();
    switch(type){
        case 'movie':
            socket.emit('removeWatchedMovie', watchId.toString());
            document.getElementById(watchId+'movwat').remove();
            document.getElementById(watchId+'allwat').remove();
            break;
        case 'tv':
            socket.emit('removeWatchedTv', watchId.toString());
            document.getElementById(watchId+'tvwat').remove();
            document.getElementById(watchId+'allwat').remove();
            break;
        default:
            return;
    }
}