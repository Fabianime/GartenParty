var express			=		require("express");
var bodyParser		=		require("body-parser");
var app				=		express();
const https 		=		require('https');
const querystring 	= 		require('querystring');
var fs 				=		require('fs');
const path			=		require('path');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page. */
app.post('',function(request, response){
	var credentials = JSON.parse(fs.readFileSync(path.resolve("credentials", 'spotify.json'), "UTF-8"));
	const clientID = credentials.clientID;
	const clientSecret = credentials.clientSecret;

	var post_data = querystring.stringify({
		'grant_type': 'client_credentials'
  	});

	const options = {
	  hostname: 'accounts.spotify.com',
	  port: 443,
	  path: '/api/token',
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': Buffer.byteLength(post_data),
	    'Authorization': 'Basic ' + Buffer.from( clientID + ':' + clientSecret ).toString('base64')
	  }
	};

	const pos_request = https.request(options, (pos_response) => {
	  	pos_response.setEncoding('utf8');
	  	pos_response.on('data', (chunk) => {
	    	response.status(200);
			response.send(JSON.stringify({"status": 200, "error": null, "response": chunk}));
	  	});
	});

	pos_request.on('error', (e) => {
	  	response.status(500);
		response.send(JSON.stringify({"status": 500, "error": e.message, "response": null})); 
	});

	// post the data
  	pos_request.write(post_data);
	pos_request.end(post_data);
});

module.exports = app;
