/* jshint node: true */
'use strict';

var LocalStrategy = require('passport-local').Strategy;

var credentials = require('../config/credentials');

module.exports = function (passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function (user, done) {
		console.log('Serializing');
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function (id, done) {
		console.log('DeSerializing');
		done(null, { id: credentials.userId });
	});

	// =========================================================================
	// LOCAL LOGIN  ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password,
		// we will override with email
		usernameField: 'email',
		passwordField: 'password',

		// allows us to pass back the entire request to the callback
		passReqToCallback: true,
	}, function (req, email, password, done) {
		// callback with email and password from our form
		email = email.toLowerCase();

		// For the purposes of demoing, only need one verified login
		if (email === 'demo@justdancefor.me' &&
			password === credentials.password) {
			return done(null, { id: credentials.userId });
		} else {
			req.session.submission = req.body;
			return done(null, false, req.flash('loginFlash', {
				text: 'That email/password combination is invalid.',
				class: 'danger',
			}));
		}
	}));
};
