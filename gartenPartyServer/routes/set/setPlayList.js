var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/:gartenPartyID/:aTitles', function(req, res, next) {
	const gartenPartyID = req.params.gartenPartyID;
	var aTitles = req.params.aTitles;

	const sFilePath = "playLists/" + gartenPartyID + '.json';

	var bError = false;
	var sError = "";
	var playList = {};

	if(aTitles.charAt(0) !== "["){
		bError = true;
		sError = "Second Argument is not an Array";
		console.log(e);
	}

	try{
		aTitles = JSON.parse(aTitles);
	}catch(e){
		bError = true;
		sError = "Second Argument is not an Array";
		console.log(e);
	}
	
	if(!bError){	
		fs.open('myfile', 'r', (err, fd) => {
			if (err) {
				if (err.code === 'ENOENT') {
					playList = fs.readFileSync(sFilePath, "UTF-8");
				}else{
					sError = err;
					bError = true;
				}
			}
			if(!bError){
				try{
					playList = JSON.parse(playList);
				}catch(e){
					bError = true;
					sError = "Playlist is broken. Pleas Contact an Admin."
					console.log(e);
				}
				if(!bError){
					console.log(aTitles);
					for(let i = 0; i < aTitles.length; i++){
						playList.playlist.push(aTitles[i]);
					}

					fs.writeFile(sFilePath, JSON.stringify(playList), (err) => {
					  if (err) {
					  	sError = err;
					  	bError = true;
					  }
					});
				}
			}

			if(bError === true){
				res.send(JSON.stringify({"status": 500, "error": sError, "response": null})); 
				//If there is error, we send the error in the error section with 500 status
			} else {
				console.log('playList:' + playList);
				res.send(JSON.stringify({"status": 200, "error": null, "response": JSON.stringify(playList)}));
				//If there is no error, all is good and response is 200OK.
			}

		});
	}else{
		res.send(JSON.stringify({"status": 500, "error": sError, "response": null})); 
	}
});

module.exports = router;
