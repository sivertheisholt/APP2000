const Session = require("../database/sessionSchema")

exports.session_get = async function(req, res) {
    return await Session.findOne({_id: req.sessionID});
}