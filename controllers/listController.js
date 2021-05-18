const hjelpeMetoder = require('../handling/hjelpeMetoder');
const logger = require('../logging/logger')
const ValidationHandler = require('../handling/ValidationHandler');

//Liste med lister her
exports.list_get = async function(req, res) {
    res.render("list/lists", req.renderObject);
}

//En liste som skal vises
exports.list_get_content = async function(req, res) {
    console.log("Hi");
    res.render("list/listContent", req.renderObject);
}