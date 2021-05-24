//Password
let dashboardNewPassword = document.getElementById('dashboard-new-password');
let dashboardNewPasswordRepeat = document.getElementById('dashboard-new-password-repeat');
let dashboardPasswordChangeBtn = document.getElementById('dashboard-change-pw-btn');
let dashboardPasswordError = document.getElementById('dashboard-password-error');

//Username
let dashboardUsernameChangeBtn = document.getElementById('dashboard-username-btn');
let dashboardUsernameInput = document.getElementById('dashboard-username-input');
let dashboardUsernameError = document.getElementById('dashboard-username-error');

//Upload
let dashboardUploadBtn = document.getElementById('dashboard-upload-btn');
let dashboardAvatarFile = document.getElementById('avatar');
let dashboardAvatarError = document.getElementById('dashboard-avatar-error');

let dashboardUploadForm = document.getElementById('dashboard-upload-form');

/**
 * EventListener for å bytte passord
 * Sender ajax call for å endre passord inne i brukerdashbord
 * @author Ørjan Dybevik - 233530
 */
dashboardPasswordChangeBtn.addEventListener("click", function(e){
    e.preventDefault();
    dashboardPasswordError.style.display = 'none';
    dashboardPasswordError.innerHTML = "";
    //Lager info
    dash_change_pw_details = {
        dashboardNewPassword: dashboardNewPassword.value,
        dashboardNewPasswordRepeat: dashboardNewPasswordRepeat.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/user/dashboardChangePassword`, {dash_change_pw_details: dash_change_pw_details});

    //Om suksess
    jqxhr.done(async function(result) {
        dashboardNewPassword.value = '';
        dashboardNewPasswordRepeat.value = '';
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/user/dashboard`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        dashboardPasswordError.style.display = 'block';
        dashboardPasswordError.innerHTML = result.responseJSON.error;
    });
});

/**
 * EventListener for å endre brukernavn
 * Sender ajax call for å endre brukernavn inne i brukerdashbord
 * @author Ørjan Dybevik - 233530
 */
dashboardUsernameChangeBtn.addEventListener("click", function(e){
    e.preventDefault();
    dashboardUsernameError.style.display = 'none';
    dashboardUsernameError.innerHTML = "";
    //Lager info
    dash_change_username_details = {
        username: dashboardUsernameInput.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/user/changeUsername`, {dash_change_username_details: dash_change_username_details});

    //Om suksess
    jqxhr.done(async function(result) {
        dashboardUsernameInput.value = '';
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/user/dashboard`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        dashboardUsernameError.style.display = 'block';
        dashboardUsernameError.innerHTML = result.responseJSON.error;
    });
});

/**
 * EventListener for å endre profilbilde
 * Sender ajax call for å endre profilbilde inne i brukerdashbord
 * @author Ørjan Dybevik - 233530
 */
dashboardUploadForm.addEventListener("submit", function(e){
    e.preventDefault();
    let avatar = dashboardAvatarFile.files[0];
    let formdata = new FormData();
    formdata.append("avatar", avatar);
    var jqxhr = $.ajax({
        url: `/${urlPath}/user/upload-avatar`,
        type: 'POST',
        data: formdata,
        contentType: false,
        processData: false,
    });

    //Om suksess
    jqxhr.done(async function(result) {
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/user/dashboard`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        dashboardAvatarError.style.display = 'block';
        dashboardAvatarError.innerHTML = result.responseJSON.error;
    });
});