var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/:gartenPartyID', function(req, res, next) {
	var gartenPartyID = req.params.gartenPartyID;
	var gartenpartys = JSON.parse(fs.readFileSync("gartenpartys.json", "UTF-8"));
	var error = "Well Shit";
	var bOkay = false;

	for(let i = 0; i < gartenpartys.partys.length;i++){
		if(gartenpartys.partys[i] == gartenPartyID){
			bOkay = true;
		}
	}

	if(gartenpartys == ""){
		res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
		//If there is error, we send the error in the error section with 500 status
	} else {
		res.send(JSON.stringify({"status": 200, "error": null, "response": bOkay}));
		//If there is no error, all is good and response is 200OK.
	}
});

module.exports = router;
