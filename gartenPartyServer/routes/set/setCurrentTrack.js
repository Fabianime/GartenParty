var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/:gartenPartyID/:track', function(req, res, next) {
	const gartenPartyID = req.params.gartenPartyID;
	var track = req.params.track;

	const sFilePath = "currentTrack\\" + gartenPartyID + '.json';

	var bError = false;
	var sError = "";

	try{
		track = JSON.parse(track);
	}catch(e){
		bError = true;
		sError = "Second Argument is not a JSON";
		console.log(e);
	}
	
	if(!bError){
		try{
			track = JSON.parse(track);
		}catch(e){
			bError = true;
			sError = "Track is broken. Pleas Contact an Admin."
			console.log(e);
		}

		if(!bError){
			fs.writeFile(sFilePath, JSON.stringify(track), (err) => {
			  if (err) {
			  	sError = err;
			  	bError = true;
			  }
			});
		}

		if(bError === true){
			res.send(JSON.stringify({"status": 500, "error": sError, "response": null})); 
			//If there is error, we send the error in the error section with 500 status
		} else {
			console.log('track:' + track);
			res.send(JSON.stringify({"status": 200, "error": null, "response": JSON.stringify(track)}));
			//If there is no error, all is good and response is 200OK.
		}
	}else{
		res.send(JSON.stringify({"status": 500, "error": sError, "response": null})); 
	}
});

module.exports = router;
