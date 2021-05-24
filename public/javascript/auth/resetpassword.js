let resetPasswordBtn = document.getElementById('reset-password-btn');
let resetPasswordError = document.getElementById('reset-password-error');
let resetPasswordField = document.getElementById('reset-password');
let resetPasswordFieldRepeat = document.getElementById('reset-password-repeat');

/**
 * Eventlistener for å sende ajax call til å resette passord
 * @author Ørjan Dybevik - 233530
 */
resetPasswordBtn.addEventListener("click", function(e){
    resetPasswordError.style.display = 'none';
    resetPasswordError.innerHTML = "";
    e.preventDefault();
    //Lager info
    reset_pw_details = {
        newPassword: resetPasswordField.value,
        newPasswordRepeat: resetPasswordFieldRepeat.value,
        token: token
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/auth/resetPassword/:token`, {reset_pw_details: reset_pw_details});

    //Om suksess
    jqxhr.done(async function(result) {
        resetPasswordField.value = '';
        resetPasswordFieldRepeat.value = '';
        swal("Success!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        window.location.href = `/${urlPath}/homepage`;
    });

    //Om failure
    jqxhr.fail(function(result) {
        resetPasswordError.style.display = 'block';
        resetPasswordError.innerHTML = result.responseJSON.error;
    });
});