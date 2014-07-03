var reqList = require('./server.js')
var api = require('./api.js')

module.exports = {
	requestListener: reqList,
	api: api
}