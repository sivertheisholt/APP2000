const userHandler = require('../handling/userHandler');
const Session = require("../database/sessionSchema");

exports.admin_get_dashboard = async function(req, res) {
    let session = await Session.findOne({_id: req.sessionID});
    let userResult = await userHandler.getUser({_id: req.session.userId});
    if(!userResult.status) {
        res.redirect('/');
    }
    if(!userResult.information.administrator){
      res.redirect("/");
    }
    res.render("admin/admindashboard", {
      username: session ? true : false,
      admin: userResult.information.administrator,
      urlPath: res.locals.currentLang
    });
}