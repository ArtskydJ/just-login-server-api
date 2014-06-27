just-login-server-api
=====================

- [Information](https://github.com/ArtskydJ/just-login-server-api#information)
- [Install](https://github.com/ArtskydJ/just-login-server-api#install)
- [Require and Construct](https://github.com/ArtskydJ/just-login-server-api#require-and-construct)
- [Methods](https://github.com/ArtskydJ/just-login-server-api#methods)
- [jlsa.isAuthenticated(cb)](https://github.com/ArtskydJ/just-login-server-api#jlsaisauthenticatedcb)
- [jlsa.beginAuthentication(contactAddress)](https://github.com/ArtskydJ/just-login-server-api#jlsabeginauthenticationcontactaddress)

#Information

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Words below this point are probably incorrect, and will be editted soon. Please rely on nothing below this point. Thanks.

##Methods

###jlsa.isAuthenticated(cb)

Calls the callback with null or a contact address if authenticated

Example of an authenticated user (a user who was logged in previously)

	jlsa.isAuthenticated("previouslyLoggedInSessionId", function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: "fake@example.com"
	})

Example of an unauthenticated user (a user who was NOT logged in previously)

	jlsa.isAuthenticated("notPreviouslyLoggedInSessionId", function(err, contactAddress) {
		if (!err)
			console.log(contactAddress) //logs: ""
	})

###jlsa.beginAuthentication(contactAddress)

Emits an event with a secret token and the contact address, so somebody can go send a message to that address.

	var emitAuth = jlsa.beginAuthentication("wantToLogInSessionId", "fake@example.com")
	emitAuth.on('authentication initiated', function(authInit) {
		console.log(authInit.token)     //logs the secret token
		console.log(authInit.sessionId) //logs the session id
	})

(Suggestion: use the [Just-Login-Emailer](https://github.com/coding-in-the-wild/just-login-emailer) or my fork of the same [emailer](https://github.com/ArtskydJ/just-login-emailer) for this.)
