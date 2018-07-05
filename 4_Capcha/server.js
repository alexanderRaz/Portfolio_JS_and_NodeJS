var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var getCaptcha = require('./getCaptcha.js');

var app = express();

app.use(session({
	secret: ' 23msdfl34kasd ',
	resave: false, //
	saveUninitialized: false,
	name: 'sid',
	cookie: {httpOnly: true, maxAge: 600000} 
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', function(req, res) {
	console.log('Cookies: ', req.cookies);	
})

app.get('/captcha', function(req, res){
	getCaptcha(function(err, str, buffer){
		if(err) return next(err);
		req.session.captcha = str;
		res.set('Content-Type', 'image/png');
		res.send(buffer);
	});
});

app.get('/admin', function(req, res){
	if(req.session.auth){
		res.send('Панель администратора!!!');
	} else {
		res.redirect('/enter.html');
	}
});

app.post('/enter', function(req, res){
	if(req.session.captcha === req.body.keystring){
		req.session.auth = true;
		res.redirect('/admin');
	} else {
		res.redirect('/enter.html');
	}
});

app.listen(8000);
