just-login-server-api
=====================

- [Information](#information)
- [Install](#install)
- [Require and Construct](#require-and-construct)
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

Install with npm:

	npm install just-login-server-api
	
##Require and Construct

Require:

	var Jlsa = require('just-login-server-api')

Set up a Just Login Core object:

	var Jlc = require('just-login-core')
	var level = require('level-mem')
	var db = level('uniqueNameHere')
	var jlc = Jlc(db)

Merge the modules:

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

`cb` has the arguments: `err`, and `contactAddress`, respectively.

`contactAddress` will be null if not authenticated; it will be a contact address if authenticated.

Example of an authenticated user (a user who was logged in previously)

	api.isAuthenticated(function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: "fake@example.com"
	})

Example of an unauthenticated user (a user who was NOT logged in previously)

	api.isAuthenticated(function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: ""
	})

###api.beginAuthentication(contactAddress)

The just-login-core emits an event with a secret token and the contact address, so somebody can go send a message to that address. This event is emitted when jlc.beginAuthentication is called. When using the just-login-core and the just-login-server-api together, the just-login-core will emit an event when the just-login-server-api's `beginAuthentication()` is called.

	jlsa.beginAuthentication("fake@example.com")

	jlc.on('authentication initiated', function(authInit) { //Note that this is jlc, not jlsa
		console.log(authInit.token)     //logs the secret token
		console.log(authInit.sessionId) //logs the session id
	})

(Suggestion: use the [Just-Login-Emailer](https://github.com/coding-in-the-wild/just-login-emailer) or my fork of the same [emailer](https://github.com/ArtskydJ/just-login-emailer) to catch the event.)

###api.unauthenticate(cb)

Logs a user out.

`cb` has the argument: `err`

	jlc.unauthenticate(function(err) {
		if (err && err.invalidToken)
			console.log("invalid token")            //this is expected for invalid tokens
		else if (err)
			console.log("error:", err.message)      //this is never expected, but can happen
		else
			console.log("you have been logged out") //this is expected for valid tokens
	})
