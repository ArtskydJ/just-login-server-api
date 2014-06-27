var test = require('tap').test
var Jlsa = require('../')

test('test for new session', function(t) {
	t.plan(4)
	var sessionIdentification
	var jlsa = new Jlsa({
		isAuthenticated: function(sId) {
			t.equal(sId, sessionIdentification, "session ID is correct")
		},
		beginAuthentication: function(sId, addr) {
			t.equal(sId, sessionIdentification, "session ID matches")
			t.equal(typeof addr, "string", "the contact address is a string :)")
		},
		unAuthenticate: function(sId) {
			t.equal(sId, sessionIdentification, "session ID is correct")
		}
	})
	jlsa.createNewSession(function(err, fullApi, sessionId) {
		sessionIdentification = sessionId
		fullApi.isAuthenticated()
		fullApi.beginAuthentication("I am a string")
		fullApi.unAuthenticate()
		t.end()
	})
})

test('test for continued sesssion', function(t) {
	t.plan(6)
	var sessionIdentification = "the session"
	var contactAddress = "so true"
	var jlsa = new Jlsa({
		isAuthenticated: function(sId, cb) {
			t.equal(sId, sessionIdentification, "session ID is correct")
			cb(null, contactAddress)
		},
		beginAuthentication: function(sId, addr) {
			t.equal(sId, sessionIdentification, "session ID matches")
			t.equal(typeof addr, "string", "the contact address is a string :)")
			t.equal(addr, contactAddress, "the contact address is.")
		},
		unAuthenticate: function(sId) {
			t.equal(sId, sessionIdentification, "session ID is correct")
		}
	})

	jlsa.continueExistingSession(sessionIdentification, function(err, api, session) {
		t.equal(session, sessionIdentification, "yes the session id still matches")
		api.beginAuthentication(contactAddress)
		api.unAuthenticate()
	})
})
