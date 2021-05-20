const listCreater = require('../systems/listSystem/listCreater');
const userHandler = require('../handling/userHandler');
const listEditor = require('../systems/listSystem/listEditor');

exports.list_new = async function(socket, info) {
    const userResult = await userHandler.getUserFromId(info.userId);
    const result = await listCreater.createList(userResult.information, info.name);
    socket.emit('newListResult', userResult.information.lists[userResult.information.lists.length-1]);
}

exports.add_movie_to_list = async function(socket, list) {
    const result = await listEditor.addMovieToList(list.listid, list.movieid);
    socket.emit('displayMovieList', result);
}

exports.add_tv_to_list = async function(socket, list) {
    const result = await listEditor.addTvToList(list.listid, list.tvid);
    socket.emit('displayTvList', result);
}