var multer  = require('multer')

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
}).single('avatar');

module.exports = upload;