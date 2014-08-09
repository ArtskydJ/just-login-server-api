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

function createNewSession(jlc, cb) { //cb(err, api, sessionId)
	var sessionId = UUID()
	cb(null, getFullApi(jlc, sessionId), sessionId)
}

function continueExistingSession(jlc, sessionId, cb) { //cb(err, api, sessionId)
	jlc.isAuthenticated(sessionId, function (err, addr) {
		if (err) {
			cb(err)
		} else if (!addr) {
			cb(new Error("Invalid Session Id"))
		} else {
			cb(null, getFullApi(jlc, sessionId), sessionId)
		}
	})
}

module.exports = function Jlsa(justLoginCore) { //Exposed to the browser via dnode
	return {
		createNewSession: createNewSession.bind(null, justLoginCore),
		continueExistingSession: continueExistingSession.bind(null, justLoginCore)
	}
}
