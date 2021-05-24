let deleteListBtn = document.getElementById('deleteListBtn');
let listid = deleteListBtn.getAttribute('data-listid');

/**
 * Funksjon for å fjerne en spesifikk film/serie fra listen
 * @param {Number} id Id til film/serie
 * @param {'movie'|'tv'} type movie/tv
 * @param {String} listid Id til listen
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * EventListener for å slette en liste
 * @author Ørjan Dybevik - 233530
 */
deleteListBtn.addEventListener("click", function(){
    socket.emit('deleteList', listid);
    window.location.href = `/${urlPath}/user/dashboard?error=redirected&errorType=mylist`;
}); 