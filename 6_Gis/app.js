var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var model = require('./model/model.js')

server.listen(8080);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/html/index.html');
});

io.on('connection', function(socket){
	
	socket.on('newGeoData', function(data){
		console.log(data);
		model.newGeoData(data, function(err, node){
			console.log(node);
		});
	});
	
	socket.on('query', function(data){
		console.log(data);
		model.query(data, function(err, nodes){
			console.log(nodes);
			socket.emit('query', nodes);
		});
	});
});
