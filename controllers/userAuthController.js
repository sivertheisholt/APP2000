const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");
const hjelpeMetoder = require('../handling/hjelpeMetoder');
let mailer = require('../handling/mailer');
const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');
const userHandler = require('../handling/userHandler');

/**
 * Get for å logge ut. Clearer cookies
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Sivert - 233518
 */
exports.userAuth_get_logout = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /logout`}); 
    req.session.destroy(err => {
        res.clearCookie('connect.sid')
        res.redirect(`/${req.renderObject.langCode}/home`)
    })
}

/**
 * Get for passord reset siden. Sender videre en unik token som må være lik den token brukeren har fått opprettet i databasen
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @author Ørjan Dybevik - 233530
 */
exports.userAuth_get_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/:token`});
    let token = req.params.token;
    req.renderObject.token = token;
    res.render("auth/resetpassword", req.renderObject);
}

/**
 * Post for å lage brukerkonto. Validerer mail og passord, sjekker at mailen ikke er brukt før.
 * Krypterer etterpå passordet og lagrer brukerkonto i databasen.
 * En automatisk mail blir sendt til nye brukere.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns Message
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
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
}

/**
 * Post for å tilbakestille passord.
 * Mail sjekkes opp mot databasen og det opprettes en unik token og resetlink som sendes til brukerens email.
 * 
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns Message
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
exports.userAuth_post_forgottenPassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /forgottenPassword`}); 
    const pugBody = req.body.forgot_pw_details;

    //Skaffer bruker
    const userResult = await userHandler.getUserFromEmail(pugBody.email);
    if(!userResult.status) {
        logger.log({level: 'debug', message: `User with email ${pugBody.email} does not exist`}); 
        return res.status(400).send({error: req.__('ERROR_USER_DOESNT_EXIST')});
    }

    //Lager token og oppdaterer bruker
    const token = jwt.sign({_id: userResult.information._id}, process.env.RESET_PASSWORD_KEY, {expiresIn:'60m'});
    const updateUser = await userHandler.updateUser(userResult.information, {resetLink: token});
    if(!updateUser.status) {
        logger.log({level: 'debug', message: `Reset password link error`}); 
        return res.status(400).send({error: req.__('ERROR_RESET_PASSWORD_LINK')});
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
        <h3>This link will expire in 60 minutes</h3>
        <a href='${link}'>Click here to reset your password</a>
        `
    });

    //Suksess
    res.status(200).send({message: req.__('SUCCESS_FORGOTTEN_PASSWORD')});
}

/**
 * Get for innlogging. Sjekker at bruker finnes i databasen og passord er korrekt.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns Message
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
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
}

/**
 * Post for å resette passord, sjekker først om token stemmer med den den som finnes i brukerens database.
 * Sjekker at linken ikke er utgått og gjør de generelle passordsjekkene vi har satt som krav.
 * Hasher passordet og lagrer det nye passordet til brukeren.
 * @param {Object} req Forespørsel fra klient
 * @param {Object} res Respons fra server
 * @returns Message
 * @author Ørjan Dybevik - 233530, Sivert - 233518
 */
exports.userAuth_post_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetPassword/:token`}); 

    //Skaffer link og info
    const pugBody = req.body.reset_pw_details;
    const resetLink = pugBody.token;

    //Sjekker om link eksisterer
    if(!resetLink){
        logger.log({level: 'error', message: `Authentication error`});
        return res.status(400).send({error: req.__('ERROR_AUTHENTICATION')});
    }

    //Sjekker info
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async function(err, decodedData) {
        if(err) {
            logger.log({level: 'debug', message: `Incorrect token or it has expired`});
            return res.status(400).send({error: req.__('ERROR_EXPIRED_TOKEN')});
        }
        let resetLinkConfirmed = pugBody.token;

        //Skaffer bruker
        const userResult = await userHandler.getUser({resetLink: resetLinkConfirmed})
        if(!userResult.status) {
            logger.log({level: 'debug', message: `User with this token doesn't exist`});
            return res.status(400).send({error: req.__('ERROR_USER_TOKEN_DOESNT_EXIST')});
        }

        //Sjekker at passord tilfredstiller krav
        if(!(hjelpeMetoder.data.validatePassword(pugBody.newPassword))){
            logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
            return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_PROPERLY_FORMATTED')});

        }

        //Sjekker om felt er like
        if(!(pugBody.newPassword == pugBody.newPasswordRepeat)) {
            logger.log({level: 'debug', message: `Passwords do not match`});
            return res.status(400).send({error: req.__('ERROR_PASSWORD_NOT_MATCH')});
        }

        //Nå må vi lage ny salt for å hashe passord
        const salt = await bcrypt.genSalt(10);

        //Nå setter vi passord til det hasha passordet
        const password = await bcrypt.hash(pugBody.newPassword, salt);

        //Lagrer bruker
        const updateUser = await userHandler.updateUser(userResult.information, {password: password, resetLink: ''});
        if(!updateUser.status) {
            logger.log({level: 'debug', message: `Could not change password`});
            return res.status(400).send({error: req.__('ERROR_COULD_NOT_CHANGE_PASSWORD')});
        }

        //Suksess
        logger.log({level: 'debug', message: `Password successfully changed for user`});
        res.status(200).send({message: req.__('SUCCESS_PASSWORD_CHANGE')});
    })
}