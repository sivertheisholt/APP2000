const hjelpemetoder = require('../handling/hjelpeMetoder');
const fs = require('fs');
const reviewEditor = require('../systems/reviewSystem/reviewEditor');
const reviewGetter = require('../systems/reviewSystem/reviewGetter');
const ticketEditor = require('../systems/ticketSystem/ticketEditor');
const userHandler = require('../handling/userHandler');
const ValidationHandler = require('../handling/ValidationHandler');
const logger = require('../logging/logger');


/**
 * Leser filen med angitt språkkode og sender den til klienten
 * @param {Object} socket 
 * @param {Number} langId 
 * @author Ørjan Dybevik - 233530
 */
async function getLanguage(socket, langId){
    let language = await hjelpemetoder.data.lesFil(`./lang/${langId}.json`);
    socket.emit('displayLang', language.information);
}

/**
 * Lagrer endringer til angitt språk
 * @param {Object} socket 
 * @param {Object} args språkId og nye språkendringer
 */
async function saveLanguage(socket, args){
    fs.writeFile(`./lang/${args.langId}.json`, args.langContent,(err) =>{
        if(err){
            logger.log({level: 'error', message: `There was an error when saving language file: ${err}`});
        }
        logger.log({level: 'debug', message: 'File has been saved..'});
    });
    socket.emit('savedLanguage');
}

/**
 * Tar inn en id og godkjenner anmeldelsen fra brukeren
 * @param {Object} socket 
 * @param {Number} reviewId id til anmeldelsen
 * @author Ørjan Dybevik - 233530
 */
async function approveReview(socket, reviewId){
    let result = await reviewEditor.approveReview(reviewId);
    socket.emit('approveReviewResult', result);
}

/**
 * Avslår en anmeldelse
 * @param {Object} socket 
 * @param {Object} review Id til anmeldelsen og grunnlag
 * @author Ørjan Dybevik - 233530
 */
async function denyReview(socket, review){
    let result = await reviewEditor.denyReview(review.reviewId, review.reason);
    socket.emit('denyReviewResult', result);
}

/**
 * Henter anmeldelser basert på filmId og type media(film/tv)
 * @param {Object} socket 
 * @param {Object} media id til film/serie og type film/tv
 * @author Ørjan Dybevik - 233530
 */
async function getReviewsFromMedia(socket, media){
    let result = await reviewGetter.getApprovedReviews(media.mediaId, media.type);
    socket.emit('getReviewsFromMediaResult', result);
}

/**
 * Svarer på ticket
 * @param {Object} socket 
 * @param {Object} ticket id, tekst og tittel
 * @author Ørjan Dybevik - 233530
 */
async function respondTicket(socket, ticket){
    let result = await ticketEditor.finishTicket(ticket);
    socket.emit('respondTicketResult', result);
}

/**
 * Redigerer en anmeldelse
 * @param {Object} socket 
 * @param {Object} review id, text og rating
 * @author Ørjan Dybevik - 233530
 */
async function editReview(socket, review){
    let result = await reviewEditor.editReview(review.reviewId, review.newText,review.newRating);
    socket.emit('editReviewResult', result);
}

/**
 * Henter alle reviews
 * @param {Object} socket 
 * @param {Object} review film/serie id og type tv/movie
 * @author Ørjan Dybevik - 233530
 */
async function getReviewListToDelete(socket, review){
    let result = await reviewGetter.getApprovedReviews(review.mediaId, review.type);
    socket.emit('getReviewFromMediaToDeleteResult', result);
}

/**
 * Sletter en bestemt review
 * @param {Object} socket 
 * @param {Number} reviewid id til anmeldelse
 * @author Ørjan Dybevik - 233530
 */
async function deleteReview(socket, reviewid){
    let result = await reviewEditor.deleteApproved(reviewid);
    socket.emit('deleteReviewResult', result);
}

/**
 * Utestenger en bruker med mail
 * @param {Object} socket 
 * @param {String} userEmail Email
 * @author Ørjan Dybevik - 233530
 */
async function adminBanUser(socket, userEmail){
    let result;
    let user = await userHandler.getUserFromEmail(userEmail);
    if(!user.information.banned){
        result = await userHandler.updateUser(user.information, {banned: true});
        result.information = 'User has been banned';
    } else {
        result = new ValidationHandler(false, 'User is already banned!');
    }
    socket.emit('adminBanUserResult', result);
}

/**
 * Fjerner utestengelse til bruker med mail
 * @param {Object} socket 
 * @param {String} userEmail Email
 * @author Ørjan Dybevik - 233530
 */
async function adminUnbanUser(socket, userEmail){
    let result;
    let user = await userHandler.getUserFromEmail(userEmail);
    if(user.information.banned){
        result = await userHandler.updateUser(user.information, {banned: false});
        result.information = 'User has been unbanned';
    } else {
        result = new ValidationHandler(false, 'User is already unbanned!');
    }
    socket.emit('adminBanUserResult', result);
}

module.exports = {getLanguage, saveLanguage, approveReview, denyReview, getReviewsFromMedia, respondTicket, editReview, getReviewListToDelete,deleteReview, adminBanUser, adminUnbanUser}