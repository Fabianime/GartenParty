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
	var videoUrlToDelete = request.body.videoUrlToDelete;

	const playlistPath = path.resolve("./playlists/", playlistID + '.json');
	const elementsToDelete = [];
	var checkError = false;
	var errorMessage = "";
	var playList = {};
	
	fs.open('myfile', 'r', (err, fd) => {
		if (err) {
			if (err.code === 'ENOENT') {
				playList = fs.readFileSync(playlistPath, "UTF-8");
			}else{
				errorMessage = err;
				checkError = true;
			}
		}
		if(!checkError){
			try{
				playList = JSON.parse(playList);
			}catch(e){
				checkError = true;
				errorMessage = "Playlist is broken. Please Contact an Admin."
			}
			if(!checkError){

				for(let i = 0; i < playList.playlist.length; i++){
					if(playList.playlist[i].url === videoUrlToDelete){
						elementsToDelete.push(i);
					}
				}

				for (var i = elementsToDelete.length - 1; i >= 0; i--) {
					playList.playlist.splice(elementsToDelete[i], 1);
				}

				fs.writeFile(playlistPath, JSON.stringify(playList), (err) => {
				  if (err) {
				  	errorMessage = err;
				  	checkError = true;
				  }
				});
			}
		}

		if(checkError === true){
			response.status(500);
			response.send(JSON.stringify({"status": 500, "error": errorMessage, "response": null})); 
			//If there is error, we send the error in the error section with 500 status
		} else {
			response.status(200);
			response.send(JSON.stringify({"status": 200, "error": null, "response": ''}));
			//If there is no error, all is good and response is 200OK.
		}

	});
});

module.exports = app;
