const filterMetode = require('../handling/filter');

/**
 * Viser ett array med media fra mest populær til minst
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaDesc(socket, args) {
    socket.emit('displayFilteredMedia', args);
}

/**
 * Viser ett array med media fra minst populær til mest
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaAsc(socket, args) {
    args.reverse();
    socket.emit('displayFilteredMedia', args);
}

/**
 * Viser ett array med media med sortert dato, nyest til eldst
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaSortByDateDesc(socket, args) {
    args.sort(filterMetode.getSortOrderDateDesc);
    socket.emit('displayFilteredMedia', args);
}

/**
 * Viser ett array med media med sortert dato, eldst til nyest
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaSortByDateAsc(socket, args) {
    args.sort(filterMetode.getSortOrderDateAsc);
    socket.emit('displayFilteredMedia', args);
}

/**
 * Viser ett array med media sortert alfabetisk
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaSortByTitleAZ(socket, args) {
    args.sort(filterMetode.getSortOrderAZ('title'));
    socket.emit('displayFilteredMedia', args);
}

/**
 * Viser ett array med media sortert motsatt alfabetisk rekkefølge
 * @param {socket} socket 
 * @param {array} args 
 */
async function popularMediaSortByTitleZA(socket, args) {
    args.sort(filterMetode.getSortOrderZA('title'));
    socket.emit('displayFilteredMedia', args);
}


/**
 * Tar inn ett array og viser kun filmene av valgt genre
 * @param {socket} socket 
 * @param {array, genre} args 
 */
async function filterByGenre(socket, args) {
    let filteredList = [];
    for (let i in args.arr){
        if(args.arr[i].genre.includes(parseInt(args.genreId))){
            filteredList.push(args.arr[i]);
        }
    }
    socket.emit('displayFilteredMedia', filteredList);
}





module.exports = {popularMediaDesc, popularMediaAsc, popularMediaSortByDateDesc, popularMediaSortByDateAsc, popularMediaSortByTitleAZ, popularMediaSortByTitleZA, filterByGenre}