var express = require('express');
var router = express.Router();
var fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/:gartenPartyID', function(req, res, next) {
	var gartenPartyID = req.params.gartenPartyID;
	var playList = fs.readFileSync(path.resolve("playLists", gartenPartyID + '.json'), "UTF-8");

	if(playList == ""){
		res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": playList}));
		//If there is no error, all is good and response is 200OK.
	}
});

module.exports = router;
