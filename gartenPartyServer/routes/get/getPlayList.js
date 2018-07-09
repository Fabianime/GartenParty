var express			=		require("express");
var bodyParser		=		require("body-parser");
var app				=		express();
var fs 				= 		require('fs');
const path			= 		require('path');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page. */
app.post('',function(request,response){
	var playlistID=request.body.playlistID;
	console.log(request.body);
	var playList = fs.readFileSync(path.resolve("playlists", playlistID + '.json'), "UTF-8");
	if(playList == ""){
		response.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		response.send(JSON.stringify({"status": 200, "error": null, "response": playList}));
		//If there is no error, all is good and response is 200OK.
	}
});

/* GET home page. */
module.exports = app;
