var fs = require('fs')
var jsdom = require('jsdom');
var moment = require('moment');
var svg2png = require('svg2png');
var express = require('express');
var bodyParser = require('body-parser');
var chart = require('./chart/render.js');
var tools = require('./lib/tools.js');

var app = express();
var content = '<svg id="box"></svg>';
global.box = undefined;

app.use(bodyParser.json());

app.post('/render/', function(request, response) {
	console.log('post at /render/: ' + moment().format());

	var file = new Date().getTime().toString();
	var filename = file + '.png'; // system file name
	var svgname = file + '.svg';
	var data = request.body;

    if(tools.isJsonEmpty(data)){
    	console.log("The post data is empty...");
        response.send({"msg": "The post data is empty."});
     } else {
     	// handle filename
     	if(data['filename'] !== undefined){
			filename = data['filename'];
			svgname = data['filename'].split('.')[0] + '.svg';
		}
		// render chart
		jsdom.env({ features : { QuerySelector : true },
			html : content, done : function(errors, window) {
				box = window.document.querySelector('#box');
			    chart.renderSvgToPng(data, svgname);
			    // convert to png
			    svg2png(svgname, filename, function (err) {
			        if(err) {
			            console.log(svgname + ' to ' + filename + ' failed.', err);
			            response.send({"msg": "fail"});
			        } else {
			            console.log(svgname + ' to ' + filename + ' successfully.');
			            response.send({"msg": "ok", "filename": filename});
			        }
	    		});
		    }
	    });
	}
}); // end app.post

// png service
app.get('/png/:name', function (req, res, next) {

	var filename = req.params.name;
	console.log('get at /' + filename + ':' + moment().format());

	var options = {
	    root: __dirname + '/',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true,
	        'Content-Type': 'image/png'
	    }
	};

	res.sendFile(filename, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', filename);
	    }
	});
});

// svg service
app.get('/svg/:name', function (req, res, next) {

	var filename = req.params.name;
	console.log('get at /' + filename + ':' + moment().format());

	var options = {
	    root: __dirname + '/',
	    headers: {
	        'x-timestamp': Date.now(),
	        'x-sent': true,
	        'Content-Type': 'image/svg+xml'
	    }
	};

	res.sendFile(filename, options, function (err) {
		if (err) {
			console.log(err);
			res.status(err.status).end();
		} else {
			console.log('Sent:', filename);
	    }
	});
});

app.listen(3000);
