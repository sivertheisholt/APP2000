const userHandler = require('../../../handling/userHandler');

/**
 * Sjekker om bruker er admin
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @author Sivert - 233518
 */
exports.user_check_admin = async function(req, res, next) {
    let userResult = await userHandler.getUser({uid: req.session.userId});
    if(!userResult.status) {
        res.redirect(`/${res.locals.currentLang}/home`);
    }
    if(!userResult.information.administrator){
      res.redirect(`/${res.locals.currentLang}/home`);
    }
    next();
}

/**
 * Sjekker om bruker er logget inn
 * @param {object} req En forespørsel fra klienten
 * @param {object} res En respons fra server
 * @param {callback} next Neste
 * @author Sivert - 233518
 */
exports.user_check_loggedIn = async function(req, res, next) {
    let userResult = await userHandler.getUser({uid: req.session.userId});
    if(!userResult.status) {
        res.redirect(`/${res.locals.currentLang}/home`);
    }
    next();
}