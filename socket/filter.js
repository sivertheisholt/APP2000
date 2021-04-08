const filterMetode = require('../handling/filter');

async function popularMediaDesc(socket, args) {
    socket.emit('displayFilteredMedia', args);
}

async function popularMediaAsc(socket, args) {
    args.reverse();
    socket.emit('displayFilteredMedia', args);
}

async function popularMediaSortByDateDesc(socket, args) {
    args.sort(filterMetode.getSortOrderDateDesc);
    socket.emit('displayFilteredMedia', args);
}

async function popularMediaSortByDateAsc(socket, args) {
    args.sort(filterMetode.getSortOrderDateAsc);
    socket.emit('displayFilteredMedia', args);
}

async function popularMediaSortByTitleAZ(socket, args) {
    args.sort(filterMetode.getSortOrderAZ('title'));
    socket.emit('displayFilteredMedia', args);
}

async function popularMediaSortByTitleZA(socket, args) {
    args.sort(filterMetode.getSortOrderZA('title'));
    socket.emit('displayFilteredMedia', args);
}



module.exports = {popularMediaDesc, popularMediaAsc, popularMediaSortByDateDesc, popularMediaSortByDateAsc, popularMediaSortByTitleAZ, popularMediaSortByTitleZA}