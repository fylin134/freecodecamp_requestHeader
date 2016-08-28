var express = require('express');
var path = require('path');
var https = require('https');
var os = require('os');

var app = express();
var port = process.env.PORT || 8080;

function callback(result)
{
	alert(result[0].ip);
}


app.get('/api/whoami', function(req, res)
{
	var str_ip = "";
	var str_language = "";
	var str_software = "";	

	// Get User language
	str_language = req.headers["accept-language"];

	// Get User Operating Info
	var arch = os.arch();
	var platform = process.platform;

	str_software = platform + " " + arch;

	// Get IP Address
	var options = require('url').parse("https://api.ipify.org?format=json");
	options.rejectUnauthorized = false;
	options.agent = new https.Agent( options );
	// Make request
	https.get(options, function(getres)
	{
		var json_ip = "";
		getres.setEncoding('utf8');
		getres.on('data', function(chunk){
			json_ip += chunk;
		});
		getres.on('end', function(){
			str_ip = (JSON.parse(json_ip)).ip;		

			// Create JSON response
			var json_res = 
			{
				'ip' : str_ip,
				'language' : str_language,
				'software' : str_software
			};	
			res.end(JSON.stringify(json_res));
		});
	}).on('error', function(err){
		console.log('problem with request:' +err);
	});	
});

app.listen(port);