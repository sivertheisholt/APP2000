const Bruker = require('../database/brukerSchema');
const bcrypt = require("bcrypt");
const hjelpeMetoder = require('../handling/hjelpeMetoder');
var mailer = require('../handling/mailer');
const jwt = require('jsonwebtoken');
const logger = require('../logging/logger');

exports.userAuth_get_logout = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /logout`}); 
    req.session.destroy(err => {
        res.clearCookie('connect.sid')
        res.redirect(`/${res.locals.currentLang}/homepage`)
    })
}

exports.userAuth_get_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/:token`}); 
    let token = req.params.token;
    req.renderObject.token = token;
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
    const pugBody = req.body; //Skaffer body fra form
    //Sjekker at mail tilfredsstiller krav
    if(!(hjelpeMetoder.data.validateEmail(pugBody.email))){
        logger.log({level: 'debug', message: `Email ${pugBody.email} is not properly formatted!`}); 
        res.redirect(`/${res.locals.currentLang}/homepage?error=Email is not properly formatted&errorType=signup`);
        return;
    }
    if(await Bruker.findOne({email: pugBody.email})) {
        logger.log({level: 'debug', message: `Email ${pugBody.email} is already taken!`});
        res.redirect(`/${res.locals.currentLang}/homepage?error=Email is already taken&errorType=signup`);
        return;
    }
    //Sjekker at passord tilfredstiller krav
    if(!(hjelpeMetoder.data.validatePassword(pugBody.password))){
        logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
        res.redirect(`/${res.locals.currentLang}/homepage?error=Password is not properly formatted&errorType=signup`);
        return;
    }
    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.email && pugBody.password && pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
        res.redirect(`/${res.locals.currentLang}/homepage?error=Data is not properly formatted&errorType=signup`);
        return;
    }
    //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
    if(!(pugBody.password == pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
        res.redirect(`/${res.locals.currentLang}/homepage?error=Passwords do not match&errorType=signup`);
        return;
    }

    //Nå må vi lage et nytt bruker objekt
    const bruker = new Bruker(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);
    bruker.save().then((dokument, err) => {
        if(err) {
            logger.log({level: 'error', message: `Could not save user to database! Error: ${err}`});
            return;
        }
        logger.log({level: 'debug', message: `Saving user to database`}); 
        mailer({
            from: process.env.EMAIL,
            to: bruker.email, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
            subject: 'Welcome to Filmatory!',
            text: `<h1>Hope you enjoy your time at Filmatory!</h1>`
        });
    })
    res.redirect(`/${res.locals.currentLang}/homepage`);
}

exports.userAuth_post_forgottenPassword = function(req, res) {
    logger.log({level: 'debug', message: `Request received for /forgottenPassword`}); 
    const pugBody = req.body;
    Bruker.findOne({email: pugBody.emailForgottenPassword}, (err, bruker) => {
        if(!bruker) {
            logger.log({level: 'error', message: `User with email ${pugBody.emailForgottenPassword} does not exist`}); 
            res.redirect(`/${res.locals.currentLang}/homepage?error=User with this email does not exist&errorType=forgottenPassword`);
            return;
        }
        if(err) {
            logger.log({level: 'error', message: `Something went wrong when finding user! Error: ${err}`});
            res.redirect(`/${res.locals.currentLang}/homepage?error=Something went wrong&errorType=forgottenPassword`);
        }
        const token = jwt.sign({_id: bruker._id}, process.env.RESET_PASSWORD_KEY, {expiresIn:'60m'});
        return bruker.updateOne({resetLink: token}, function(success, err) {
            if(err) {
                logger.log({level: 'error', message: `Something unexpected happen! Error: ${err}`}); 
                res.redirect(`/${res.locals.currentLang}/homepage?error=Reset password link error&errorType=forgottenPassword`);
                return;
            } else {
                let link = `${req.renderObject.url}/${req.renderObject.urlPath}/auth/resetpassword/${token}`
                logger.log({level: 'debug', message: `Link ${link} sent`}); 
                mailer({
                    from: process.env.EMAIL,
                    to: bruker.email,
                    subject: 'Password Reset Link',
                    html: `
                    <h2>Please click on the link below reset your password</h2>
                    <p>${link}</p>
                    `
                });
                res.redirect(`/${res.locals.currentLang}/homepage`);
            }
        })
    })
}

exports.userAuth_get_login = async function(req,res ) {
    logger.log({level: 'debug', message: `Request received for /login`}); 
    const pugBody = req.body; //Skaffer body fra form
    const bruker = await Bruker.findOne({email: pugBody.email}); //Finner brukeren fra databasen
    //Nå skal vi sjekke om passordet stemmer
    if(bruker) {
        const sjekkPassword = await bcrypt.compare(pugBody.password, bruker.password); //Bruker bcrypt for å sammenligne, true/false return
        if(bruker.banned){
            res.redirect(`/${res.locals.currentLang}/homepage?error=This user is banned&errorType=login`);
        }
        if (sjekkPassword) {
            logger.log({level: 'debug', message: `Setting session`}); 
            req.session.userId = bruker._id; //Setter session
            res.redirect(`/${res.locals.currentLang}/homepage`);
            return;
        } else {
            logger.log({level: 'debug', message: `Invalid password for ${bruker._id}`}); 
            res.redirect(`/${res.locals.currentLang}/homepage?error=Invalid Password&errorType=login`);
            return;
        }
    } else {
        logger.log({level: 'debug', message: `User does not exist`}); 
        res.redirect(`/${res.locals.currentLang}/homepage?error=User does not exist&errorType=login`);
        return;
    }
}

exports.userAuth_post_resetpassword = function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetPassword/:token`}); 
    const resetLink = req.params.token;
    const pugBody = req.body;
    console.log(resetLink);
    if(resetLink){
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function(err, decodedData) {
            if(err) {
                logger.log({level: 'error', message: `Incorrect token or it has expired`});
                return res.redirect(`/${res.locals.currentLang}/auth/resetpassworderror`);
            }
            Bruker.findOne({resetLink}, async (bruker, err) => {
                if(err) {
                    logger.log({level: 'error', message: `Something unexpected happen when trying to find user! Error: ${err}`});
                    return res.redirect(`/${res.locals.currentLang}/auth/resetpassword/${resetLink}?error=Unexpected error when trying to find user&errorType=resetPassword`);
                }
                if(!bruker) {
                    logger.log({level: 'error', message: `User with this token does not exist`});
                    return res.redirect(`/${res.locals.currentLang}/auth/resetpassword/${resetLink}?error=User with this token does not exist&errorType=resetPassword`);
                }
                if(!(pugBody.newPassword == pugBody.newPasswordRepeat)) {
                    logger.log({level: 'debug', message: `Passwords do not match`});
                    return res.redirect(`/${res.locals.currentLang}/auth/resetpassword/${resetLink}?error=Passwords do not match&errorType=resetPassword`);
                }
                //Nå må vi lage ny salt for å hashe passord
                const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

                //Nå setter vi passord til det hasha passordet
                bruker.password = await bcrypt.hash(pugBody.newPassword, salt);
                bruker.resetLink = '';

                bruker.save((result, err) => {
                    if(err) {
                        logger.log({level: 'error', message: `Something unexpected happen when trying to save user to database! Error: ${err}`});
                        return res.redirect(`/${res.locals.currentLang}/auth/resetpassword/${resetLink}?error=Could not change password&errorType=resetPassword`);
                    } else {
                        logger.log({level: 'debug', message: `Password successfully changed for user`});
                        return res.redirect(`/${res.locals.currentLang}/auth/resetpasswordsuccess`);
                    }
                })
            })
        })
    }else {
        logger.log({level: 'error', message: `Authentication error`});
        return res.status(401).json({error: 'Authentication error!!!'});
    }
}