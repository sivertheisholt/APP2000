let deleteListBtn = document.getElementById('deleteListBtn');
let listid = deleteListBtn.getAttribute('data-listid');

function removeFromList(id, type, listid){
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

deleteListBtn.addEventListener("click", function(){
    socket.emit('deleteList', listid);
}); 