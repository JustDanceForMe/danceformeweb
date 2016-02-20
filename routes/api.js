/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();

/*
 * GET Requests
 */

/*
 * POST Requests
 */

router.logout = function (req, res) {
	req.logout();
	req.flash('loginFlash', {
		text: 'You have been logged out.',
		class: 'success',
	});
	res.end(JSON.stringify({ redirect: '/login' }));
};

module.exports = router;
