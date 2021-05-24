const listCreater = require('../systems/listSystem/listCreater');
const userHandler = require('../handling/userHandler');
const listEditor = require('../systems/listSystem/listEditor');

/**
 * Lager en ny liste
 * @param {Object} socket Socket som brukes
 * @param {Object} info Informasjon
 * @author Sivert - 233518
 */
exports.list_new = async function(socket, info) {
    const userResult = await userHandler.getUserFromId(info.userId);
    const result = await listCreater.createList(userResult.information, info.name);
    socket.emit('newListResult', userResult.information.lists[userResult.information.lists.length-1]);
}

/**
 * Legger til film i liste
 * @param {Object} socket Socket som brukes
 * @param {Object} info Informasjon
 * @author Ørjan - 233530 
 */
exports.add_movie_to_list = async function(socket, list) {
    const result = await listEditor.addMovieToList(list.listid, list.movieid);
    socket.emit('displayMovieList', result);
}

/**
 * Legger til serie i liste
 * @param {Object} socket Socket som brukes
 * @param {Object} info Informasjon
 * @author Ørjan - 233530 
 */
exports.add_tv_to_list = async function(socket, list) {
    const result = await listEditor.addTvToList(list.listid, list.tvid);
    socket.emit('displayTvList', result);
}

/**
 * Fjerner serie fra liste
 * @param {Object} socket Socket som brukes
 * @param {Object} listinfo Informasjon
 * @author Ørjan - 233530 
 */
exports.remove_tv_from_list = async function(socket, listinfo) {
    const result = await listEditor.deleteTvFromList(listinfo.listid, listinfo.tvid);
}
/**
 * Fjerner film fra liste
 * @param {Object} socket Socket som brukes
 * @param {Object} listinfo Informasjon
 * @author Ørjan - 233530 
 */
exports.remove_movie_from_list = async function(socket, listinfo) {
    const result = await listEditor.deleteMovieFromList(listinfo.listid, listinfo.movieid);
}

/**
 * Slett liste
 * @param {Object} socket Socket som brukes
 * @param {Object} listinfo Informasjon
 * @author Ørjan - 233530 
 */
exports.remove_list = async function(socket, listid) {
    const result = await listEditor.deleteList(listid);
}

