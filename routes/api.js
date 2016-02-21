/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var videoPath = 'public/data/roar.mp4';
var Firebase = require('firebase');
var credentials = require('../config/credentials');
var fbaseRoot = new Firebase('https://justdanceforme.firebaseio.com/');
var FirebaseTokenGenerator = require('firebase-token-generator');
var tokenGenerator = new FirebaseTokenGenerator(credentials.firebase);
var token = tokenGenerator.createToken({ uid: '1', isServer: true });
fbaseRoot.authWithCustomToken(token, function (error, authData) {
	if (error) {
		console.log('Login Failed!', error);
	} else {
		console.log('Login Succeeded!', authData);
	}
});

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

router.startGame = function (req, res) {
	// Initialize the game state to the beginning of a game
	var startTime = (Math.floor(new Date() / 1000) + 5) * 1000;

	var msUntilGameStart = new Date(startTime).getTime() - new Date().getTime();
	console.log('Starting game in: ' + msUntilGameStart + 'ms.');
	setTimeout(function () {
		fbaseRoot.child('gameState').update({
			running: true,
			starting: false,
		}, function () {
			console.log('updated running state to true');
		});
	}, msUntilGameStart);

	fbaseRoot.child('gameState').set({
		starting: true,
		running: false,
		startTime: startTime,
		song: 'Roar',
	}, function (error) {
		if (error) {
			throw error;
		} else {
			console.log('Started game.');
			res.end();
		}
	});

	// var hasStarted = false;
	// fbaseRoot.child('users').on('value', function (snapshot) {
	// 	if (hasStarted === false) {
	// 		var n_ready = 0;
	// 		snapshot.forEach(function (user) {
	// 			if (user.ready === true) {
	// 				n_ready++;
	// 			}
	// 		});
	// 	}
	// });
};

router.stopGame = function (req, res) {
	fbaseRoot.child('gameState').set({
		running: false,
	}, function (error) {
		if (error) {
			throw error;
		} else {
			console.log('Ended game.');
			res.end();
		}
	});

	fbaseRoot.child('authCodes').remove();

	// fbaseRoot.child('users').remove();
};

router.logout = function (req, res) {
	req.logout();
	req.flash('loginFlash', {
		text: 'You have been logged out.',
		class: 'success',
	});
	if (req.method == 'GET') {
		res.redirect('/login');
	} else {
		res.end(JSON.stringify({ redirect: '/login' }));
	}
};

module.exports = router;
