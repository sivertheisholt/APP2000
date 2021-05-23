let loginBtn = document.getElementById('login-btn');
let indexLoginEmail = document.getElementById('index-login-email');
let indexLoginPw = document.getElementById('index-login-password');
let loginErrorMsg = document.getElementById('login-error');

let signUpBtn = document.getElementById('signup-btn');
let indexSignupEmail = document.getElementById('index-signup-email');
let indexSignupPassword = document.getElementById('index-signup-password');
let indexSignupPasswordRepeat = document.getElementById('index-signup-password-repeat');
let signupErrorMsg = document.getElementById('signup-error');

let loginsignupModal = document.getElementById('modal-login-signup');

loginBtn.addEventListener("click", function(e){
    loginErrorMsg.style.display = 'none';
    loginErrorMsg.innerHTML = "";
    e.preventDefault();
    //Lager info
    login_details = {
        email: indexLoginEmail.value,
        password: indexLoginPw.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/auth/login`, {login_details: login_details});

    //Om suksess
    jqxhr.done(async function(result) {
        UIkit.modal(loginsignupModal).hide();
        indexLoginEmail.value = '';
        indexLoginPw.value = '';
        swal("Welcome!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        location.reload();
    });

    //Om failure
    jqxhr.fail(function(result) {
        loginErrorMsg.style.display = 'block';
        loginErrorMsg.innerHTML = result.responseJSON.error;
    });
});

signUpBtn.addEventListener("click", function(e){
    signupErrorMsg.style.display = 'none';
    signupErrorMsg.innerHTML = "";
    e.preventDefault();
    //Lager info
    signup_details = {
        email: indexSignupEmail.value,
        password: indexSignupPassword.value,
        passwordRepeat: indexSignupPassword.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/auth/signup`, {signup_details: signup_details});

    //Om suksess
    jqxhr.done(async function(result) {
        UIkit.modal(loginsignupModal).hide();
        indexSignupEmail.value = '';
        indexSignupPassword.value = '';
        indexSignupPasswordRepeat. value = '';
        swal("Welcome!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        location.reload();
    });

    //Om failure
    jqxhr.fail(function(result) {
        signupErrorMsg.style.display = 'block';
        signupErrorMsg.innerHTML = result.responseJSON.error;
    });
});