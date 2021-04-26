let adminBanBtn = document.getElementById('admin-user-ban');
let adminUnbanBtn = document.getElementById('admin-user-unban');
let adminGetUserBtn = document.getElementById('admin-user-get');
let adminUserEmail = document.getElementById('admin-user-email');
let adminUserResult = document.getElementById('admin-user-output');


adminBanBtn.addEventListener("click", ()=>{
    socket.emit('adminBanUser', adminUserEmail.value);
    adminUserEmail.value = '';
});

adminUnbanBtn.addEventListener("click", ()=>{
    socket.emit('adminUnbanUser', adminUserEmail.value);
    adminUserEmail.value = '';
});

socket.on('adminBanUserResult', (result) => {
    adminUserResult.innerHTML = result.information;
});