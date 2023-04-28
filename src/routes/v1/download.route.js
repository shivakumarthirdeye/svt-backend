const express = require('express');
const auth = require('../../middlewares/auth');
const { downloadController } = require('../../controllers');

const router = express.Router();

router.route('/users').get(auth(), downloadController.downloadUsers);

module.exports = router;
