const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');
const logger = require('../services/logger');

const User = require('../models/users');

module.exports.login = function (req, res) {
    User.find({ username: req.body.username }, function (err, users) {
        if (err) {
            logger.error(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: err })
        } else if (users.length == 0) {
            logger.info('User not found. Registering new user');
            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    logger.error(err);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: err.message, error: err })
                } else {
                    const UserObject = new User({
                        username: req.body.username,
                        password: hash,
                        nickname: req.body.nickname,
                        type: 'learner',
                        score: 0
                    })
                    UserObject.save((error, result) => {
                        if (error) {
                            logger.error(error);
                            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: error })
                        } else {
                            const token = jwt.sign({
                                username: req.body.username,
                                nickname: req.body.nickname,
                                userId: result._id
                            }, config.JWT_SECRET_KEY, { expiresIn: '7d' })
                            res.status(httpStatus.CREATED).json({ status: true, message: "User Added Successfully", error: null, token })
                        }
                    })
                }
            });
        } else {
            bcrypt.compare(req.body.password, users[0].password, function (err, result) {
                if (err) {
                    logger.error(err);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: err })
                } else if (!result) {
                    logger.info('User Authentication Failed');
                    res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "User Authentication Failed", error: null })
                } else if (req.body.nickname === users[0].nickname && users[0].type == 'learner') {
                    const token = jwt.sign({
                        username: users[0].username,
                        email: users[0].email,
                        userId: users[0]._id,
                        type: users[0].type
                    }, config.JWT_SECRET_KEY, { expiresIn: '7d' })
                    res.status(httpStatus.OK).json({ status: true, message: "Auth Successfully", error: null, token })
                } else {
                    logger.info('User Authentication Failed');
                    res.status(httpStatus.OK).json({ status: false, message: "User Authentication Failed", error: null })
                }
            });
        }
    })
}

module.exports.addScore = function (req, res) {
    if (req['userInfo'] && req['userInfo'].userId) {
        let id = req['userInfo'].userId;
        User.findById({ _id: id }, function (err, users) {
            if (err) {
                logger.error(err);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: err })
            } else if (!users) {
                logger.error('UserId Not found');
                res.status(httpStatus.NOT_FOUND).json({ status: false, message: 'User Not Found', error: null })
            } else {
                const updateObject = {};
                updateObject['score'] = req.body.score;
                updateObject['timetaken'] = req.body.timetaken;

                User.update({ _id: id }, { $set: updateObject }, function (error, result) {
                    if (error) {
                        logger.error(error);
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: error })
                    } else {
                        res.status(httpStatus.OK).json({ status: true, message: "User Score Updated Successfully", error: null, result })
                    }
                })
            }
        })
    } else {
        logger.error(error);
        res.status(httpStatus.NOT_FOUND).json({ status: false, message: 'User Id Not Found', error: null })
    }
}

module.exports.adminLogin = function (req, res) {
    User.find({ username: req.body.username }, function (err, users) {
        if (err) {
            logger.error(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: err })
        } else if (users.length == 0) {
            logger.info('Admin User not found.');
            res.status(httpStatus.OK).json({ status: false, message: "User Not Found", error: null })
        } else if (users[0].type == 'admin') {
            bcrypt.compare(req.body.password, users[0].password, function (err, result) {
                if (err) {
                    logger.error(err);
                    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: err })
                } else if (!result) {
                    logger.info('User Authentication Failed');
                    res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "User Authentication Failed", error: null })
                } else {
                    const token = jwt.sign({
                        username: users[0].username,
                        userId: users[0]._id,
                        type: users[0].type
                    }, config.JWT_SECRET_KEY, { expiresIn: '7d' })
                    res.status(httpStatus.OK).json({ status: true, message: "Auth Successfully", error: null, token })
                }
            });
        } else {
            logger.info('Admin User not found.');
            res.status(httpStatus.OK).json({ status: false, message: "Sorry! You're not an admin", error: null })
        }
    })
}

module.exports.getAllUsersList = function (req, res) {
    if (req['userInfo'] && req['userInfo'].userId && req['userInfo'].type == 'admin') {
        User.find({ type: 'learner' }, { _id: 1, username: 1, nickname: 1, score: 1, timetaken: 1 }, (error, result) => {
            if (error) {
                logger.error(error);
                res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ status: false, message: error.message, error: error })
            } else {
                res.status(httpStatus.OK).json({ status: true, message: "Customer List Fetched Successfully", error: null, Records: result })
            }
        })
    } else {
        logger.info('User Authentication Failed');
        res.status(httpStatus.UNAUTHORIZED).json({ status: false, message: "User Authentication Failed", error: null })
    }
}