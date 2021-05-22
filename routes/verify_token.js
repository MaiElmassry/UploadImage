const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const token = req.header('Authorization')
    if (!token) return res.status(401).send('UnAuthrized')
    try{
        const verified = jwt.verify(token, process.env.TokenSecret);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send('Invalid Token')

    }
    
}

module.exports.auth = auth