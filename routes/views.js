/* jshint node: true */
'use strict';

var express = require('express');
var router = express.Router();

router.index = function (req, res) {
	res.redirect('/login');
};

router.renderLogin = function (req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}

	res.render('login.jade', {
		title: 'Login',
		messages: req.flash('loginFlash'),
		submission: sub,
	});
};

router.renderConnect = function (req, res) {
	res.render('connect.jade', {
		title: 'Connect',
		messages: req.flash('connectFlash'),
	});
};

router.renderSetup = function (req, res) {
	var sub = {};
	if (req.session.submission) {
		sub = req.session.submission;
		req.session.submission = null;
	}

	res.render('setup.jade', {
		title: 'Setup',
		messages: req.flash('setupFlash'),
		submission: sub,
	});
};

router.renderPlay = function (req, res) {

	res.render('play.jade', {
		title: 'Play',
		messages: req.flash('playFlash'),
	});
};

router.renderMobile = function (req, res) {
	res.render('mobile.jade', {});
};

module.exports = router;
