const userHandler = require('../handling/userHandler');
const Session = require("../database/sessionSchema");

exports.admin_get_dashboard = async function(req, res) {
    res.render("admin/admindashboard", req.renderObject);
}