function removeFromList(id, type, listid){
    console.log(id);
    console.log(listid);
    switch(type){
        case 'movie':
            socket.emit('removeMovieFromList', {movieid: id, listid: listid});
            document.getElementById(id).innerHTML = "";
            break;
        case 'tv':
            socket.emit('removeTvFromList', {tvid: id, listid: listid});
            document.getElementById(id).innerHTML = "";
            break;
        default:
            return;
    }
}