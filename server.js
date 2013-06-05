var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');

app.configure(function() {
	app.use(express.static(path.resolve(__dirname, './')));
});

app.get('/', function(req, res) {
	fs.createReadStream('./index.html').pipe(res);
});

app.get('/rest/:epoch', function(req, res) {
	//console.log(req.params.epoch);
	fs.createReadStream('./sample.json').pipe(res);
});

app.listen(3000);
