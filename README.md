just-login-server-api
=====================

- [Information](#information)
- [Install](#install)
- [Jlsa(jlc)](#jlsajlc)
- [jlsa methods](#jlsa-methods)
	- [jlsa.createNewSession(cb)](#jlsacreatenewsessioncb)
	- [jlsa.continueExistingSession(sessionId, cb)](#jlsacontinueexistingsessionsessionid-cb)
- [api methods](#api-methods)
	- [api.isAuthenticated(cb)](#apiisauthenticatedcb)
	- [api.beginAuthentication(contactAddress)](#apibeginauthenticationcontactaddress)
	- [api.unauthenticate(cb)](#apiunauthenticatecb)

##Information

Server for the Just Login module.

The constructor takes a just-login-core constructed object

##Install

Will need the [Just-Login-Core](github.com/ArtskydJ/just-login-core) module also. (Or an object that closely resembles a Just-Login-Core.)

Install both with npm:

	npm install just-login-server-api just-login-core
	
##Jlsa(jlc)

Require both:

	var Jlsa = require('just-login-server-api')
	var Jlc = require('just-login-core')

Set up the server-api with a core and the core with a levelup database:

	var level = require('level-mem')
	var db = level('uniqueNameHere')
	var jlc = Jlc(db)
	var jlsa = Jlsa(jlc)

##jlsa methods

###jlsa.createNewSession(cb)

	jlsa.createNewSession(function (err, api, sessionId) {
		if (!err) {
			console.log(api) //logs { beginAuthentication: [Function],
			                 //       isAuthenticated: [Function],
			                 //       unAuthenticate: [Function] }
			console.log(sessionId) //logs the session id string
		}
	})

###jlsa.continueExistingSession(sessionId, cb)

	jlsa.continueExistingSession(sessionId, function(err, api, sessionId) {
		if (!err) {
			console.log(api) //logs { beginAuthentication: [Function],
			                 //       isAuthenticated: [Function],
			                 //       unAuthenticate: [Function] }
			console.log(sessionId) //logs the session id string
		} else if (err.invalidSessionId) {
			console.log("bad session id passed to continueExistingSession")
		} else {
			console.log("error:", err.message)
		}
	})

##api methods

These methods are from the `api` argument from either [`createNewSession()`](#jlsacreatenewsessioncb) or [`continueExistingSession()`](#jlsacontinueexistingsessionsessionid-cb).

###api.isAuthenticated(cb)

Checks if a user is authenticated. (Logged in.)

- `cb` is a function with these arguments: `err`, `contactAddress`.
	- `err` is null if there was no error, and is an Error object if there was an error.
	- `contactAddress` is null is the user is not authenticated, and is a string of their contact address if they are authenticated.

Example of an authenticated user:

	jlc.isAuthenticated(function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: "fake@example.com"
	})

Example of an unauthenticated user:

	jlc.isAuthenticated(function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: "null"
	})

###api.beginAuthentication(contactAddress)

The just-login-core emits an event with a secret token and the contact address, so somebody can go send a message to that address. This event is emitted when jlc.beginAuthentication is called. When using the just-login-core and the just-login-server-api together, the just-login-core will emit an event when the just-login-server-api's `beginAuthentication()` is called.

- `contactAddress` is string of the user's contact info, (usually an email address).

Example:

	jlsa.beginAuthentication("fake@example.com")

	jlc.on('authentication initiated', function(authInit) { //Note that this is jlc, not jlsa
		console.log(authInit.token)     //logs the secret token
		console.log(authInit.sessionId) //logs the session id
	})

(Suggestion: use the [Just-Login-Emailer](https://github.com/coding-in-the-wild/just-login-emailer) or my fork of the same [emailer](https://github.com/ArtskydJ/just-login-emailer) to catch the event.)

###api.unauthenticate(cb)

Logs a user out.

- `cb` is expected to be a function with the following argument:
	- `err` is either null or an error object.

Example:

	jlc.unauthenticate(function(err) {
		if (err)
			console.log("error:", err.message) //this is expected for invalid tokens (not previously logged in)
		else
			console.log("you have been logged out") //this is expected for valid tokens (previously logged in)
	})
