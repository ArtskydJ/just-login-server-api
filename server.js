var dnode = require('dnode')
var http = require('http')
var shoe = require('shoe')
var url = require('url')
var send = require('send')
var Router = require('router')

var jlServer = function jlServer(port) {
	var route = Router()
	var api = require('./api.js')
	var server = http.createServer()

	server.on('request', function (req, res) {
		send(req, url.parse(req.url).pathname, {root: ""})
			.on('error', function (err) {
				console.log("err:", err.message)
			})
			.on('file', function (path, stat) {
				console.log("file req:",path)
			})
			.on('directory', function() {
				console.log("directory")
				res.statusCode = 301;
				res.setHeader('Location', req.url + '/');
				res.end('Redirecting to ' + req.url + '/');
			}).on('headers', function (res, path, stat) {
				console.log('headers')
				res.setHeader('Content-Disposition', 'attachment');
			})
			.pipe(res)
	})
	server.listen(port)

	route.all("", function(req, res) {
		console.log("routing lol")
	})

	var sock = shoe(function (stream) {
		var d = dnode(api)
		d.pipe(stream).pipe(d)
	})
	sock.install(server, '/dnode') //name of socket?

	return server
}

module.exports = jlServer
