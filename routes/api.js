/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var videoPath = 'public/data/roar.mp4';

/*
 * GET Requests
 */
router.streamVideo = function (req, res) {
	var range = req.headers.range;
	var positions = range.replace(/bytes=/, '').split('-');
	var start = parseInt(positions[0], 10);

	fs.stat(videoPath, function (err, stats) {
		if (err) {
			throw err;
		}

		var total = stats.size;
		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		var chunksize = (end - start) + 1;

		res.writeHead(206, {
			'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		});

		var stream = fs.createReadStream(videoPath, {
			start: start,
			end: end,
		}).on('open', function () {
			stream.pipe(res);
		}).on('error', function (err) {
			res.end(err);
		});
	});
};

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
