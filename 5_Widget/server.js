var express = require('express');
var data = require('./data.json');

var app = express();

app.use(express.static('public'));

app.get('/get_widget_data', function(req, res, next){
	var arr = [];
	arr.push(data[Math.floor(Math.random()*data.length)]);
	arr.push(data[Math.floor(Math.random()*data.length)]);
	arr.push(data[Math.floor(Math.random()*data.length)]);
	res.send(arr);
});

app.listen(80);