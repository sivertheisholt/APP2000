exports.api_check_token = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    if(!req.headers.authorization === process.env.API_KEY) {
        return res.status(401).json({error: 'Invalid token provided!'})
    }
    next();
}