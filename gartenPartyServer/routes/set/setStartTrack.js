var express			=		require("express");
var bodyParser		=		require("body-parser");
var app				=		express();
var fs 				=		require('fs');
const path			=		require('path');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page. */
app.post('',function(request,response){
	const playlistID = request.body.playlistID;
	const startTrackPosition = req.params.startTrackPosition;

	const startTrackPath = path.resolve("startTrack",  playlistID + '.json');
	const startTrackData = {'start': now(), 'playlistPosition' : startTrackPosition};
	
	fs.writeFileSync(startTrackPath, JSON.stringify(startTrackData));
	response.status(200);
	response.send(JSON.stringify({"status": 200, "error": null, "response": 'File saved.'}));
});

module.exports = app;
