const userHandler = require('../../../handling/userHandler');

exports.user_check_admin = async function(req, res) {
    let userResult = await userHandler.getUser({_id: req.session.userId});
    if(!userResult.status) {
        res.redirect('/');
    }
    if(!userResult.information.administrator){
      res.redirect("/");
    }
    next();
}

exports.user_check_loggedIn = async function(req, res) {
    let userResult = await userHandler.getUser({_id: req.session.userId});
    if(!userResult.status) {
        res.redirect('/');
    }
    next();
}