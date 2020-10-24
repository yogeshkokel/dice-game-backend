const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/auth');

const userController = require('../controllers/users.controller');

// Users Routes
router.route('/login')
    .post(userController.login)

router.route('/add-score')
    .post(checkAuth, userController.addScore)

//Admin Routes
router.route('/admin-login')
    .post(userController.adminLogin)

router.route('/users-list')
    .get(checkAuth,userController.getAllUsersList)        
module.exports = router;
