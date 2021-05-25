const sessionHandler = require('../../../handling/sessionHandler.js');
const userhandler = require('../../../handling/userHandler.js');

/**
 * Skaffer all informasjon som er felles for alle requests
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @author Ørjan - 233530, Sivert - 233518
 */
exports.renderObject = async function (req, res, next) {
    const renderObject = {};
    const sessionResult = await sessionHandler.getSessionFromId(req.sessionID);
    if(sessionResult.status) {
        const userResult = await userhandler.getUserFromId(req.session.userId);
        if(!userResult.status)
            throw new Error(userResult.information);
        renderObject.admin = userResult.information.administrator;
        renderObject.user = userResult.information;
    } else {
        renderObject.admin = undefined;
        renderObject.userId = JSON.stringify("");
    }
    renderObject.session = sessionResult.status;
    renderObject.redirect = undefined
    renderObject.to = undefined
    if(req.query.redirect) {
        renderObject.redirect = JSON.stringify(req.query.redirect);
        renderObject.to = JSON.stringify(req.query.to);
    }
    renderObject.urlPath = res.locals.currentLang;
    renderObject.lang = res.locals.lang;
    renderObject.langCode = res.locals.langCode;
    renderObject.langs = res.locals.langs;
    renderObject.url = process.env.NODE_ENV == 'debug' ? 'localhost:3000' : 'https://filmatoryeksamen.herokuapp.com';
    req.renderObject = renderObject;
    next();
}