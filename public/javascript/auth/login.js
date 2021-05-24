//Login
let loginBtn = document.getElementById('login-btn');
let indexLoginEmail = document.getElementById('index-login-email');
let indexLoginPw = document.getElementById('index-login-password');
let loginErrorMsg = document.getElementById('login-error');

//Signup
let signUpBtn = document.getElementById('signup-btn');
let indexSignupEmail = document.getElementById('index-signup-email');
let indexSignupPassword = document.getElementById('index-signup-password');
let indexSignupPasswordRepeat = document.getElementById('index-signup-password-repeat');
let signupErrorMsg = document.getElementById('signup-error');

//Modal
let loginsignupModal = document.getElementById('modal-login-signup');

//Glemt passord
let forgotPasswordBtn = document.getElementById('forgot-password-btn');
let indexForgotPwEmail = document.getElementById('index-forgot-pw-email');
let forgotPwErrorMsg = document.getElementById('forgot-error');
let forgotPasswordModal = document.getElementById('modal-forgot-password');

/**
 * Eventlistener for å sende ajax call til å logge inn
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Eventlistener for å sende ajax call til å melde seg opp
 * @author Ørjan Dybevik - 233530
 */
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

/**
 * Eventlistener for å sende ajax call for å tilbakestille passord ved glemt passord
 * @author Ørjan Dybevik - 233530
 */
forgotPasswordBtn.addEventListener("click", function(e){
    forgotPwErrorMsg.style.display = 'none';
    forgotPwErrorMsg.innerHTML = "";
    e.preventDefault();
    //Lager info
    forgot_pw_details = {
        email: indexForgotPwEmail.value
    }
    //Sender post
    var jqxhr = $.post(`/${urlPath}/auth/forgottenPassword`, {forgot_pw_details: forgot_pw_details});

    //Om suksess
    jqxhr.done(async function(result) {
        UIkit.modal(forgotPasswordModal).hide();
        indexForgotPwEmail.value = '';
        swal("Sent!", result.message, "success",{
            buttons: false,
        });
        await new Promise(r => setTimeout(r, 3000));
        location.reload();
    });

    //Om failure
    jqxhr.fail(function(result) {
        forgotPwErrorMsg.style.display = 'block';
        forgotPwErrorMsg.innerHTML = result.responseJSON.error;
    });
});