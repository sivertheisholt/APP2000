var multer  = require('multer');
var path = require('path');
const logger = require("../logging/logger");
const ValidationHandler = require('./ValidationHandler');

var Storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, "./public/uploads/");
    },
    filename: function(req, file, callback){
        callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    },
});
var upload = multer ({
    storage: Storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('avatar');

function checkFileType(file, cb){
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
      } else {
        cb(new ValidationHandler(false,'Only Images'));
      }
}

module.exports = upload;