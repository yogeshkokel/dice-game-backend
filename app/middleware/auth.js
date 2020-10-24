const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const config = require('../config')

module.exports = function (req, res, next) {
    try {
        const decoded = jwt.verify(req.headers.authorization, config.JWT_SECRET_KEY);
        req['userInfo'] = decoded;
        next();
    } catch (error) {
        res.status(httpStatus.FORBIDDEN).json({ status: false, message: 'Auth Failed', error: error })
    }
}