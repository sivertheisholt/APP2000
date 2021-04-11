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
        res.redirect('/')
    })
}

exports.userAuth_get_resetpassword = async function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetpassword/:token`}); 
    let token = req.params.token
    res.render("auth/resetpassword", {
        token: token
    });
}

exports.userAuth_post_signup = async function(req,res ) {
    logger.log({level: 'debug', message: `Request received for /signup`}); 
    const pugBody = req.body; //Skaffer body fra form
    //Sjekker at mail tilfredsstiller krav
    if(!(hjelpeMetoder.data.validateEmail(pugBody.email))){
        logger.log({level: 'debug', message: `Email ${pugBody.email} is not properly formatted!`}); 
        res.redirect('/?error=Email is not properly formatted&errorType=signup');
        return;
    }
    if(await Bruker.findOne({email: pugBody.email})) {
        logger.log({level: 'debug', message: `Email ${pugBody.email} is already taken!`});
        res.redirect('/?error=Email is already taken&errorType=signup');
        return;
    }
    //Sjekker at passord tilfredstiller krav
    if(!(hjelpeMetoder.data.validatePassword(pugBody.password))){
        logger.log({level: 'debug', message: `Password is not properly formatted!`}); 
        res.redirect('/?error=Password is not properly formatted&errorType=signup');
        return;
    }
    //Vi gjør en sjekk at alle feltene er fylt inn
    if(!(pugBody.email && pugBody.password && pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `All form inputs are not filled!`}); 
        res.redirect('/?error=Data is not properly formatted&errorType=signup');
        return;
    }
    //Vi gjør en sjekk at passord 1 er lik passord 2 (Repeat password)
    if(!(pugBody.password == pugBody.passwordRepeat)) {
        logger.log({level: 'debug', message: `Passwords do not match each other!`}); 
        res.redirect('/?error=Passwords do not match&errorType=signup');
        return;
    }

    //Nå må vi lage et nytt bruker objekt
    const bruker = new Bruker(pugBody);
    
    //Nå må vi lage ny salt for å hashe passord
    const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

    //Nå setter vi passord til det hasha passordet
    bruker.password = await bcrypt.hash(bruker.password, salt);
    bruker.save().then((err, dokument) => {
        if(err) {
            logger.log({level: 'error', message: `Could not save user to database! Error: ${err}`});
            return;
        }
        logger.log({level: 'debug', message: `Saving user to database`}); 
        mailer({
            from: process.env.EMAIL,
            to: process.env.EMAIL, //bruker.email skal brukes her når det skal testes mot "ekte" bruker,
            subject: 'Welcome to Filmatory!',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean dictum vulputate luctus.'
        });
    })
    res.redirect('/');
}

exports.userAuth_post_forgottenPassword = function(req, res) {
    logger.log({level: 'debug', message: `Request received for /forgottenPassword`}); 
    const pugBody = req.body;
    Bruker.findOne({email: pugBody.emailForgottenPassword}, (err, bruker) => {
        if(!bruker) {
            logger.log({level: 'error', message: `User with email ${pugBody.emailForgottenPassword} does not exist`}); 
            res.redirect('/?error=User with this email does not exist&errorType=forgottenPassword');
            return;
        }
        if(err) {
            logger.log({level: 'error', message: `Something went wrong when finding user! Error: ${err}`});
            res.redirect('/?error=Something went wrong&errorType=forgottenPassword');
        }
        const token = jwt.sign({_id: bruker._id}, process.env.RESET_PASSWORD_KEY, {expiresIn:'60m'});
        return bruker.updateOne({resetLink: token}, function(err, success) {
            if(err) {
                logger.log({level: 'error', message: `Something unexpected happen! Error: ${err}`}); 
                res.redirect('/?error=Reset password link error&errorType=forgottenPassword');
                return;
            } else {
                let link = `http://${process.env.CLIENT_URL}/auth/resetpassword/${token}`
                logger.log({level: 'debug', message: `Link ${link} sent`}); 
                mailer({
                    from: process.env.EMAIL,
                    to: process.env.EMAIL,
                    subject: 'Password Reset Link',
                    html: `
                    <h2>Please click on the link below reset your password</h2>
                    <p>${link}</p>
                    `
                });
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
        if (sjekkPassword) {
            logger.log({level: 'debug', message: `Setting session`}); 
            req.session.userId = bruker._id; //Setter session
            res.redirect('/');
            return;
        } else {
            logger.log({level: 'debug', message: `Invalid password for ${bruker._id}`}); 
            res.redirect('/?error=Invalid Password&errorType=login');
            return;
        }
    } else {
        logger.log({level: 'debug', message: `User does not exist`}); 
        res.redirect('/?error=User does not exist&errorType=login');
        return;
    }
}

exports.userAuth_post_resetpassword = function(req, res) {
    logger.log({level: 'debug', message: `Request received for /resetPassword/:token`}); 
    const resetLink = req.params.token;
    const pugBody = req.body;
    if(resetLink){
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function(err, decodedData) {
            if(err) {
                logger.log({level: 'error', message: `Incorrect token or it has expired`});
                return;
            }
            Bruker.findOne({resetLink}, async (err, bruker) => {
                if(err) {
                    logger.log({level: 'error', message: `Something unexpected happen when trying to find user! Error: ${err}`});
                    return;
                }
                if(!bruker) {
                    logger.log({level: 'error', message: `User with this token does not exist`});
                    return res.status(400).send({error: "User with this token does not exist"}); //Denne må endres, viser bare en error melding dersom de ikke matcher for nå
                }
                if(!(pugBody.newPassword == pugBody.newPasswordRepeat)) {
                    logger.log({level: 'debug', message: `Passwords do not match`});
                    return res.status(400).send({error: "Passwords do not match"}); //Denne må endres, viser bare en error melding dersom de ikke matcher for nå
                }
                //Nå må vi lage ny salt for å hashe passord
                const salt = await bcrypt.genSalt(10); //Her kommer await (Se async) inn (Nå venter vi til bcrypt er ferdig)

                //Nå setter vi passord til det hasha passordet
                bruker.password = await bcrypt.hash(pugBody.newPassword, salt);
                bruker.resetLink = '';

                bruker.save((err, result) => {
                    if(err) {
                        logger.log({level: 'error', message: `Something unexpected happen when trying to save user to database! Error: ${err}`});
                        return res.status(400).json({error: 'Reset password error'});
                    } else {
                        logger.log({level: 'debug', message: `Password successfully changed for user`});
                        return res.status(200).json({message: 'Your password has been changed'});
                    }
                })
            })
        })
    }else {
        logger.log({level: 'error', message: `Authentication error`});
        return res.status(401).json({error: 'Authentication error!!!'});
    }
}