var express			=		require("express");
var bodyParser		=		require("body-parser");
var app				=		express();
var fs 				=		require('fs');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* Check if Playlist exists. */
app.post('',function(request,response){
	const playlistID = request.body.playlistID;
	const playlists = JSON.parse(fs.readFileSync("playlists.json", "UTF-8"));
	
	var errorMessage = "Well Shit";
	var checkPlaylist = false;

	if(playlists === undefined){
		response.status(500);
		response.send(JSON.stringify({"status": 500, "error": errorMessage, "response": null})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		for(let i = 0; i < playlists.playlists.length;i++){
			if(playlists.playlists[i] == playlistID){
				checkPlaylist = true;
			}
		}
		response.status(200);
		response.send(JSON.stringify({"status": 200, "error": null, "response": checkPlaylist}));
		//If there is no error, all is good and response is 200OK.
	}
});

module.exports = app;
