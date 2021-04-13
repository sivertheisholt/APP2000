const sessionHandler = require('../../../handling/sessionHandler.js');
const userhandler = require('../../../handling/userHandler.js');

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
    }
    renderObject.session = sessionResult.status;
    renderObject.error = undefined
    renderObject.errorType = undefined
    if(req.query.error) {
        console.log(req.query.error)
        renderObject.error = JSON.stringify(req.query.error);
        renderObject.errorType = JSON.stringify(req.query.errorType);
    }
    renderObject.urlPath = res.locals.currentLang;
    renderObject.lang = res.locals.lang;
    renderObject.langCode = res.locals.langCode;
    renderObject.langs = res.locals.langs;
    
    req.renderObject = renderObject;
    next();
}