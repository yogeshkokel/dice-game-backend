const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');

router.use('/api/users', usersRoutes);

module.exports = router;