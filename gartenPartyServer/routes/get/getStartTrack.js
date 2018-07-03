var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');

/* GET startTrack listing. */
router.get('/:gartenPartyID', function(req, res, next) {
	var gartenPartyID = req.params.gartenPartyID;
	try{
		var startTrack = fs.readFileSync(path.resolve("startTrack", gartenPartyID + '.json'), "UTF-8");
	}
	catch(err){
		res.send(JSON.stringify({"status": 500, "error": err, "response": null})); 
	}

	if(startTrack == ""){
		res.send(JSON.stringify({"status": 500, "error": "No Track Playing for this list.", "response": ""})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": startTrack}));
		//If there is no error, all is good and response is 200OK.
	}
});


module.exports = router;
