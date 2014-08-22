function getFullApi(jlc, sessionId) {
	return {
		beginAuthentication: jlc.beginAuthentication.bind(jlc, sessionId),
		isAuthenticated: jlc.isAuthenticated.bind(jlc, sessionId),
		unauthenticate: jlc.unauthenticate.bind(jlc, sessionId)
	}
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
	return continueExistingSession.bind(null, justLoginCore)
}
