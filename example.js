var Jlsa = require('just-login-server-api')
var Jlc = require('just-login-core')
var level = require('level-mem')
var db = level('uniqueNameHere')
var jlc = Jlc(db)