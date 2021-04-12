exports.skip = function (req, res, next) {
    if(req.url.startsWith('/javascript')) {
        return;
    } else {
        next();
    }
};