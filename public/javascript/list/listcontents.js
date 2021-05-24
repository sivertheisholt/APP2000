let deleteListBtn = document.getElementById('deleteListBtn');
/**
 * Funksjon for å fjerne en spesifikk film/serie fra listen, sjekker først om brukeren er den som lagde listen før den gir tilgang til funksjonen
 * @param {Number} id Id til film/serie
 * @param {'movie'|'tv'} type movie/tv
 * @param {String} listid Id til listen
 * @returns Ingenting
 * @author Ørjan Dybevik - 233530
 */

if(isListAuthor){
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
}


/**
 * EventListener for å slette en liste, sjekker først om brukeren som er innom er den som lagde listen
 * @author Ørjan Dybevik - 233530
 */
if(isListAuthor){
    deleteListBtn.addEventListener("click", function(){
        let listid = deleteListBtn.getAttribute('data-listid');
        socket.emit('deleteList', listid);
        window.location.href = `/${urlPath}/user/dashboard?error=redirected&errorType=mylist`;
    });
}
 