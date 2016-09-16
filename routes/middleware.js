const _ = require('lodash'),
    {getSecretKeyForClientId, decrypMessage} = require('../lib/utils'),
    jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
    if (req.cookies.token && typeof req.headers.authorization === 'undefined') {
        req.headers.authorization = 'Bearer ' + req.cookies.token;
    }
    if (typeof req.headers.authorization !== 'undefined' && (req.headers.authorization.search('Bearer ') === 0)) {
        let token = req.headers.authorization.substring('Bearer '.length)
        jwt.verify(token, process.env.JWT_SECRET, (err, jwtData) => {
            if (err) {
                console.log('err', err);
                res.sendStatus(401);
            } else {
                let computeSecret = getSecretKeyForClientId(process.env.PUBLIC_KEY);
                let message = decrypMessage(jwtData.secret, computeSecret);
                message = JSON.parse(message);
                if (message.username == jwtData.username) {
                    _.each(jwtData, (value, key) => {
                        req[key] = value;
                    })
                    _.each(message, (value, key) => {
                        req[key] = value;
                    })
                    next();
                } else {
                    res.sendStatus(401);
                }

            }
        })
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    verifyAuth
}