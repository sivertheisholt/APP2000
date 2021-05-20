const listCreater = require('../systems/listSystem/listCreater');
const userHandler = require('../handling/userHandler');

exports.list_new = async function(socket, info) {
    const userResult = await userHandler.getUserFromId(info.userId);
    const result = await listCreater.createList(userResult.information, info.name);
    socket.emit('newListResult', userResult.information.lists[userResult.information.lists.length-1]);
}