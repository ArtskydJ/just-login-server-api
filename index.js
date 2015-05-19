var Expirer = require('expire-unused-keys')
var UUID = require('random-uuid-v4')

function getFullApi(jlc, sessionId) {
	return {
		beginAuthentication: jlc.beginAuthentication.bind(jlc, sessionId),
		isAuthenticated: jlc.isAuthenticated.bind(jlc, sessionId),
		unauthenticate: jlc.unauthenticate.bind(jlc, sessionId)
	}
}

function createSession(jlc, expirer, cb) { //cb(err, api, sessionId)
	var sessionId = UUID()
	expirer.touch(sessionId)
	cb(null, getFullApi(jlc, sessionId), sessionId)
}

function continueSession(jlc, expirer, sessionDb, sessionId, cb) { //cb(err, api, sessionId)
	sessionDb.get(sessionId, function (err, authed) {
		if (err && err.notFound) {
			cb(new Error("Invalid Session Id"))
		} else if (err) {
			cb(err)
		} else {
			expirer.touch(sessionId)
			cb(null, getFullApi(jlc, sessionId), sessionId)
		}
	})
}

module.exports = function sessionManager(justLoginCore, sessionDb, opts) { //Exposed to the browser via dnode
	opts = opts || {}
	var expirer = new Expirer(opts.timeoutMs || 86400000, sessionDb, opts.checkIntervalMs || 1000) //hey this needs a REAL db
	expirer.on('expire', function (key) {
		sessionDb.del(key, function () {})
	})
	return {
		createSession:     createSession.bind(null, justLoginCore, expirer),
		continueSession: continueSession.bind(null, justLoginCore, expirer, sessionDb)
	}
}
