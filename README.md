just-login-example-session-manager
=====================

A basic session manager for the [Just Login Example](http://github.com/coding-in-the-wild/just-login-example).

Run this on your server with the [Just-Login-Core](http://github.com/coding-in-the-wild/just-login-core).

##Install

Install both with npm:

	npm install just-login-example-session-manager just-login-core
	
##Usage

```js
//Require the modules you'll need
var level = require('level')
var SessionManager = require('just-login-example-session-manager')
var Core = require('just-login-core')

//Construct your objects
var db = level('./storage')
var core = Core(db)                       //Set up the core with a levelup database
var sessionManager = SessionManager(core) //Set up the session-manager with the core

//give the session manager's methods to your client here...
```

Now you've got your session manager, but you need your clients to have sessions. Give your clients the session manager.

```js
//get the session manager's methods from the server here...

//lets make a function for aquiring a session
function aquire_session(cb) {
	var session = localStorage.getItem('session')
	sessionManager.continueSession(session, function (err, api, sessionId) {
		if (!err) {
			cb(err, api, sessionId)
		} else {
			sessionManager.createSession(function (err, api, sessionId) {
				if (!err) {
					localStorage.setItem('session', sessionId)
				}
				cb(err, api, sessionId)
			})
		}
	})
}

aquire_session(function (err, api, sessionId) {
	if (err) throw err
	
	//right here you can mess with the api
	//the documentation for the api is below
})
	
```

###sessionManager.createSession(cb)

- `cb` is a function that is called on completion, with the following arguments:
	- `err` should be falsey or an error object
	- `api` should be the functions you need for basic authentication. See [API Methods](#api-methods) below.
	- `sessionId` should be a string

```js
sessionManager.createSession(function (err, api, sessionId) {
	if (!err) {
		console.log(api)
		//logs: { beginAuthentication: [Function], isAuthenticated: [Function], unAuthenticate: [Function] }
		console.log(sessionId)
		//logs the session id string, e.g. '64BDA9CC-66A2-11E4-96D1-3BA1DFC16A55'
	} else {
		console.log("error:", err.message)
	}
})
```

###sessionManager.continueSession(sessionId, cb)

- `sessionId` is a string
- `cb` is a function that is called on completion, with the following arguments:
	- `err` should be falsey or an error object
	- `api` should be the functions you need for basic authentication. See [API Methods](#api-methods) below.
	- `sessionId` should be a string

```js
sessionManager.continueSession(sessionId, function(err, api, sessionId) {
	if (!err) {
		console.log(api)
		//logs: { beginAuthentication: [Function], isAuthenticated: [Function], unAuthenticate: [Function] }
		console.log(sessionId)
		//logs the session id string, e.g. '64BDA9CC-66A2-11E4-96D1-3BA1DFC16A55'
	} else {
		console.log("error:", err.message)
	}
})
```

#api methods

These methods are from the `api` argument from either `createSession()` or `continueSession()`.

###api.isAuthenticated(cb)

Checks if a user is authenticated. (Logged in.)

- `cb` is a function with the following arguments:
	- `err` is falsey if there was no error, and is an Error object if there was an error.
	- `contactAddress` is falsey if the session isn't authenticated, and is a string of their contact address if they are authenticated.

```js
core.isAuthenticated(function(err, contactAddress) {
	if (!err) console.log(contactAddress)
	//for an authenticated user, logs: example@example.com
	//for an UNauthenticated user, logs: null
})
```

###api.beginAuthentication(contactAddress)

- `contactAddress` is string of the user's contact info, (usually an email address).

The just-login-core will emit the event, `'authentication initiated'` when this is called. If you have a listener on that event, you can make it send a message to the `contactAddress`.

```js
//This is on the client
sessionManager.beginAuthentication("fake@example.com")
```
```js
//This is on the server
core.on('authentication initiated', function(authInit) { //Note that this is the core, not the sessionManager
	console.log(authInit.token)     //logs the token
	console.log(authInit.sessionId) //logs the session id
})
```

You can use the [Just-Login-Emailer](https://github.com/coding-in-the-wild/just-login-emailer) to catch the event.

###api.unauthenticate(cb)

Logs out a session.

- `cb` is a function with the argument `err`. Defaults to noop: `function(){}`.
	- `err` is either falsey or an error object.

You can write half a dozen lines of code:

```js
api.unauthenticate(function(err) {
	if (err) {
		console.log("you already weren't logged in\nerror:", err.message)
		//this is expected for unauthenticated sessions
	} else {
		console.log("you have been logged out")
		//this is expected for authenticated sessions (previously logged in)
	}
})
```

Or you can write one:
```js
api.unauthenticate()
```

#License

[MIT](opensource.org/licenses/mit)
