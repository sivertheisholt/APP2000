let adminBanBtn = document.getElementById('admin-user-ban');
let adminUnbanBtn = document.getElementById('admin-user-unban');
let adminGetUserBtn = document.getElementById('admin-user-get');
let adminUserEmail = document.getElementById('admin-user-email');
let adminUserResult = document.getElementById('admin-user-output');

/**
 * Eventlistener for knapp som utestenger en bruker, sender videre via socket
 * @Author Ørjan Dybevik - 233530
 */
adminBanBtn.addEventListener("click", ()=>{
    socket.emit('adminBanUser', adminUserEmail.value);
    adminUserEmail.value = '';
});

/**
 * Eventlistener for knapp som fjerner utestengelsen til en bruker, sender videre via socket
 * @Author Ørjan Dybevik - 233530
 */
adminUnbanBtn.addEventListener("click", ()=>{
    socket.emit('adminUnbanUser', adminUserEmail.value);
    adminUserEmail.value = '';
});

/**
 * Viser resultat fra socket
 * @Author Ørjan Dybevik - 233530
 */
socket.on('adminBanUserResult', (result) => {
    adminUserResult.innerHTML = result.information;
});