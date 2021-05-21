let favMediaCard = document.getElementById('mediaFavoriteCard');

function removeMediaFav(id, type){
    switch(type){
        case 'movie':
            socket.emit('unFavoriteMovie', id.toString());
            break;
        case 'tv':
            socket.emit('delFavoriteTv', id.toString());
            break;
        default:
            return;
    }
}

function removeMediaWatched(id, type){
    switch(type){
        case 'movie':
            socket.emit('removeWatchedMovie', id.toString());
            break;
        case 'tv':
            socket.emit('removeWatchedTv', id.toString());
            break;
        default:
            return;
    }
}


/* socket.on('removedFavoriteResult', function(){
    favMediaCard.style.display = 'none';
}); */