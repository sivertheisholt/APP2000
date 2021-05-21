const userHandler = require('../../../handling/userHandler');

exports.user_check_admin = async function(req, res, next) {
    let userResult = await userHandler.getUser({_id: req.session.userId});
    if(!userResult.status) {
        res.redirect(`/${res.locals.currentLang}/homepage`);
    }
    if(!userResult.information.administrator){
      res.redirect(`/${res.locals.currentLang}/homepage`);
    }
    next();
}

exports.user_check_loggedIn = async function(req, res, next) {
    let userResult = await userHandler.getUser({_id: req.session.userId});
    if(!userResult.status) {
        res.redirect(`/${res.locals.currentLang}/homepage`);
    }
    next();
}