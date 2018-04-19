var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET currentTrack listing. */
router.get('/:gartenPartyID', function(req, res, next) {
	var gartenPartyID = req.params.gartenPartyID;
	try{
		var currentTrack = fs.readFileSync("currentTrack/" + gartenPartyID + '.json', "UTF-8");
	}
	catch(err){
		res.send(JSON.stringify({"status": 500, "error": err, "response": null})); 
	}

	if(currentTrack == ""){
		res.send(JSON.stringify({"status": 500, "error": "No Track Playing for this list.", "response": ""})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": currentTrack}));
		//If there is no error, all is good and response is 200OK.
	}
});


module.exports = router;
