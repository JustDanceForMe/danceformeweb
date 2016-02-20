/* jshint node: true */
'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var views = require('./routes/views');
var api = require('./routes/api');
var app = express();
var passport = require('passport');
var session = require('express-session');
var configDB = require('./config/database.js');
var flash    = require('connect-flash');
var credentials = require('./config/credentials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// required for passport
app.use(session({ secret: credentials.sessionSecret }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Pass the access level to our Jade templates
app.use(function (req, res, next) {
	res.locals.user = req.user;
	next();
});

// Connect to Firebase
// TODO

require('./config/passport.js')(passport); // pass passport for configuration

// middleware to ensure the user is authenticated.
// If not, redirect to login page.
function isLoggedIn(req, res, next) {
	console.log('Verifying logged in');
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	}
}

// middleware to redirect the user to the dashboard if they already logged in
function isNotLoggedIn(req, res, next) {
	console.log('Verifying not logged in');
	if (req.isAuthenticated()) {
		res.redirect('/play'); // TODO: redirect to connect
	} else {
		return next();
	}
}

// Render Views
app.get('/', views.index);
app.get('/login', isNotLoggedIn, views.renderLogin);
app.get('/connect', isLoggedIn, views.renderConnect);
app.get('/setup', isLoggedIn, views.renderSetup);
app.get('/play', isLoggedIn, views.renderPlay);

app.post('/api/login', passport.authenticate('local-login', {
	successRedirect: '/play',
	failureRedirect: '/login',
	failureFlash: true,
}));
app.post('/api/logout', isLoggedIn, api.logout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/* error handlers */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err,
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {},
	});
});

module.exports = app;
