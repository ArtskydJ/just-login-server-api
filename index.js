var Expirer = require('expire-unused-keys')

function getFullApi(jlc, sessionId) {
	return {
		beginAuthentication: jlc.beginAuthentication.bind(jlc, sessionId),
		isAuthenticated: jlc.isAuthenticated.bind(jlc, sessionId),
		unauthenticate: jlc.unauthenticate.bind(jlc, sessionId)
	}
}

function UUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
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

module.exports = function sessionManager(justLoginCore, sessionDb) { //Exposed to the browser via dnode
	var expirer = new Expirer(86400000, sessionDb) //hey this needs a REAL db
	expirer.on('expire', function (key) {
		sessionDb.del(key, function () {})
	})
	return {
		createSession:     createSession.bind(null, justLoginCore, expirer),
		continueSession: continueSession.bind(null, justLoginCore, expirer, sessionDb)
	}
}
