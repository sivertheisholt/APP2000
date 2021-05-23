const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");
const hjelpeMetoder = require('../handling/hjelpeMetoder');
let mailer = require('../handling/mailer');
const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');
const userHandler = require('../handling/userHandler');

exports.userAuth_get_logout = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /logout`}); 
    req.session.destroy(err => {
        res.clearCookie('connect.sid')
        res.redirect(`/${req.renderObject.langCode}/homepage`)
    })
}

exports.userAuth_get_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/:token`}); 
    req.renderObject.token = req.params.token;
    res.render("auth/resetpassword", req.renderObject);
}

exports.userAuth_get_resetpassword_success = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/success`}); 
    res.render("auth/resetpasswordsuccess", req.renderObject);
}

exports.userAuth_get_resetpassword_error = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/error`}); 
    res.render("auth/resetpassworderror", req.renderObject);
}

exports.userAuth_post_signup = async function(req,res ) {
    logger.log({level: 'debug', message: `Request received for /signup`}); 

    //Skaffer body fra form
    const pugBody = req.body.signup_details;

    //Sjekker at mail tilfredsstiller krav
    if(!(hjelpeMetoder.data.validateEmail(pugBody.email))){
        logger.log({level: 'debug', message: `Email ${pugBody.email} is not properly formatted!`}); 
        return res.status(400).send({error: req.__('ERROR_INVALID_EMAIL')});
    }

    //Sjekker om epost er tatt
    if((await userHandler.getUserFromEmail(pugBody.email)).status) {
        logger.log({level: 'debug', message: `Email ${pugBody.email} is already taken!`}); 
        return res.status(400).send({error: req.__('ERROR_EMAIL_TAKEN')});
    }

    //Sjekker at passord tilfredstiller krav
    if(!(hjelpeMetoder.data.validatePassword(pugBody.password))){
        logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
        return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_PROPERLY_FORMATTED')});
    }

    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.email && pugBody.password && pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
        return res.status(400).send({error: req.__('ERROR_MISSING_INPUT')});
    }

    //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
    if(!(pugBody.password == pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
        return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_MATCH')});
    }

    //Nå må vi lage et nytt bruker objekt
    const bruker = new Bruker(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10);

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);

    //Lagrer bruker i databasen
    const userResult = await userHandler.newUser(bruker);
    if(!userResult.status) {
        logger.log({level: 'error', message: `Unexpected error when creating user`}); 
        return res.status(400).send({error: req.__('ERROR_SIGNUP_UNEXPECTED_ERROR')});
    }

    //Sender mail til bruker
    mailer({
        from: process.env.EMAIL,
        to: bruker.email, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
        subject: 'Welcome to Filmatory!',
        html: `<h1>Hope you enjoy your time at Filmatory!</h1>`
    });

    
    //Setter session
    logger.log({level: 'debug', message: `Setting session`});
    req.session.userId = bruker._id;
    
    //Suksess
    res.status(200).send({message: req.__('SUCCESS_SIGNUP')});
    //res.redirect(`/${req.renderObject.langCode}/homepage`);
}

exports.userAuth_post_forgottenPassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /forgottenPassword`}); 
    const pugBody = req.body;

    //Skaffer bruker
    const userResult = await userHandler.getUserFromEmail(pugBody.emailForgottenPassword);
    if(!userResult.status) {
        res.redirect(`/${req.renderObject.langCode}/homepage?error=User with this email does not exist&errorType=forgottenPassword`);
        return;
    }

    //Lager token og oppdaterer bruker
    const token = jwt.sign({_id: userResult.information._id}, process.env.RESET_PASSWORD_KEY, {expiresIn:'60m'});
    const updateUser = await userHandler.updateUser(userResult.information, {resetLink: token});
    if(!updateUser.status) {
        res.redirect(`/${req.renderObject.langCode}/homepage?error=Reset password link error&errorType=forgottenPassword`);
        return;
    }
    
    //Lager link
    let link = `${req.renderObject.url}/${req.renderObject.urlPath}/auth/resetpassword/${token}`
    logger.log({level: 'debug', message: `Link ${link} sent`}); 
    
    //Sender mail
    mailer({
        from: process.env.EMAIL,
        to: userResult.information.email,
        subject: 'Password Reset Link',
        html: `
        <h2>Please click on the link below reset your password</h2>
        <p>This link will expire in 60 minutes</p>
        <p>${link}</p>
        `
    });

    //Suksess
    res.redirect(`/${req.renderObject.langCode}/homepage`);
}

exports.userAuth_get_login = async function(req,res ) {
    logger.log({level: 'debug', message: `Request received for /login`}); 

    //Skaffer body fra form
    const pugBody = req.body.login_details;
    //Skaffer bruker
    const userResult = await userHandler.getUserFromEmail(pugBody.email);
    if(!userResult.status) {
        logger.log({level: 'debug', message: `Invalid login: User does not exist`});
        return res.status(400).send({error: req.__('ERROR_USER_DOES_NOT_EXIST')});
    }

    //Sjekker om bruker er banna
    if(userResult.information.banned) {
        logger.log({level: 'debug', message: `Access denied: User ${userResult.information._id} is banned`});
        return res.status(400).send({error: req.__('ERROR_USER_IS_BANNED')});
    }

    //Sjekker passord
    const sjekkPassword = await bcrypt.compare(pugBody.password, userResult.information.password);
    if(!sjekkPassword) {
        logger.log({level: 'debug', message: `Invalid password for ${userResult.information._id}`});
        return res.status(400).send({error: req.__('ERROR_INVALID_PASSWORD')});

    }

    //Setter session
    logger.log({level: 'debug', message: `Setting session`});
    req.session.userId = userResult.information._id;

    //Suksess
    res.status(200).send({message: req.__('SUCCESS_LOGIN')});
    //res.redirect(`/${req.renderObject.langCode}/homepage`);
}

exports.userAuth_post_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetPassword/:token`}); 

    //Skaffer link og info
    const resetLink = req.params.token;
    const pugBody = req.body;

    //Sjekker om link eksisterer
    if(!resetLink){
        logger.log({level: 'error', message: `Authentication error`});
        return res.status(401).json({error: 'Authentication error!'});
    }

    //Sjekker info
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async function(err, decodedData) {
        if(err) {
            logger.log({level: 'error', message: `Incorrect token or it has expired`});
            return res.redirect(`/${req.renderObject.langCode}/auth/resetpassworderror`);
        }
        let resetLinkConfirmed = req.params.token

        //Skaffer bruker
        const userResult = await userHandler.getUser({resetLink: resetLinkConfirmed})
        if(!userResult.status) {
            res.redirect(`/${req.renderObject.langCode}/auth/resetpassword/${resetLinkConfirmed}?error=User with this token does not exist&errorType=resetPassword`);
            return;
        }

        //Sjekker at passord tilfredstiller krav
        if(!(hjelpeMetoder.data.validatePassword(pugBody.newPassword))){
            logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
            res.redirect(`/${req.renderObject.langCode}/auth/resetpassword/${resetLinkConfirmed}?error=Password is not properly formatted&errorType=resetPassword`);
            return;
        }

        //Sjekker om felt er like
        if(!(pugBody.newPassword == pugBody.newPasswordRepeat)) {
            logger.log({level: 'debug', message: `Passwords do not match`});
            res.redirect(`/${req.renderObject.langCode}/auth/resetpassword/${resetLinkConfirmed}?error=Passwords do not match&errorType=resetPassword`);
            return;
        }

        //Nå må vi lage ny salt for å hashe passord
        const salt = await bcrypt.genSalt(10);

        //Nå setter vi passord til det hasha passordet
        const password = await bcrypt.hash(pugBody.newPassword, salt);

        //Lagrer bruker
        const updateUser = await userHandler.updateUser(userResult.information, {password: password, resetLink: ''});
        if(!updateUser.status) {
            res.redirect(`/${req.renderObject.langCode}/auth/resetpassword/${resetLinkConfirmed}?error=Could not change password&errorType=resetPassword`);
            return;
        }

        //Suksess
        logger.log({level: 'debug', message: `Password successfully changed for user`});
        res.redirect(`/${req.renderObject.langCode}/auth/resetpasswordsuccess`);
    })
}