function getFullApi(jlc, sessionId) {
	return {
		beginAuthentication: jlc.beginAuthentication.bind(jlc, sessionId),
		isAuthenticated: jlc.isAuthenticated.bind(jlc, sessionId),
		unAuthenticate: jlc.unAuthenticate.bind(jlc, sessionId)
	}
}

function UUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}

function createNewSession(jlc, cb) { //cb(err, api, token)
	console.log('creating new session')
	var sessionId = UUID()
	cb(null, getFullApi(jlc, sessionId), sessionId) //obj = {token, contactAddress}
}

function continueExistingSession(jlc, sessionId, cb) { //cb(err, api, session)
	console.log('continuing old session: '+sessionId)
	jlc.isAuthenticated(sessionId, function(err, addr) {
		if (!err) {
			cb(null, getFullApi(jlc, sessionId), sessionId)
		} else { //wouldn't you want to run createNewSession here?
			cb(new Error("Invalid session identification"))
		}
	})
}

module.exports = function(justLoginCore) { //Exposed to the browser via dnode
	return {
		createNewSession: createNewSession.bind(null, justLoginCore),
		continueExistingSession: continueExistingSession.bind(null, justLoginCore)
	}
}
