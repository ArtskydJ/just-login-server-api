just-login-server-api
=====================

- [Information](#information)
- [Install](#install)
- [Require and Construct](#require-and-construct)
- [jsla methods](#jsla-methods)
- [jlsa.createNewSession(cb)](#jlsacreatenewsessioncb)
- [jlsa.continueExistingSession(sessionId, cb)](#jlsacontinueexistingsessionsessionid-cb)
- [api methods](#api-methods)
- [api.isAuthenticated(cb)](#apiisauthenticatedcb)
- [api.beginAuthentication(contactAddress)](#apibeginauthenticationcontactaddress)

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

###jlsa.createNewSession(cb) //err api sessionid

	jlsa.createNewSession(function (err, api, sessionId) {
		if (!err) {
			console.log(api) //logs { beginAuthentication: [Function],
			                 //       isAuthenticated: [Function],
			                 //       unAuthenticate: [Function] }
			console.log(sessionId) //logs the session id string
		}
	})

###jlsa.continueExistingSession(sessionId, cb) //err api sessionid

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

###api.isAuthenticated(cb)

Calls the callback with null or a contact address if authenticated

Example of an authenticated user (a user who was logged in previously)

	api.isAuthenticated("previouslyLoggedInSessionId", function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: "fake@example.com"
	})

Example of an unauthenticated user (a user who was NOT logged in previously)

	api.isAuthenticated("notPreviouslyLoggedInSessionId", function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: ""
	})

###api.beginAuthentication(contactAddress)

Emits an event with a secret token and the contact address, so somebody can go send a message to that address.

	var emitAuth = jlsa.beginAuthentication("wantToLogInSessionId", "fake@example.com")
	emitAuth.on('authentication initiated', function(authInit) {
		console.log(authInit.token)     //logs the secret token
		console.log(authInit.sessionId) //logs the session id
	})

(Suggestion: use the [Just-Login-Emailer](https://github.com/coding-in-the-wild/just-login-emailer) or my fork of the same [emailer](https://github.com/ArtskydJ/just-login-emailer) to catch the event.)

###api.unauthenticate(contactAddress)

Logs a user out

	jlc.unauthenticate(function(err) {
		if (err && err.invalidToken)                //this is expected for invalid tokens
			console.log("invalid token")
		else if (err)
			console.log("error:", err.message)      //this is never expected, but can happen
		else
			console.log("you have been logged out") //this is expected for valid tokens
	})
