const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Check if Playlist exists. */
app.post('', function (request, response) {
    const playlistID = request.body.playlistID;
    const listOfPlaylist = JSON.parse(fs.readFileSync("playlists.json", "UTF-8"));

    const errorMessage = "Well Shit";
    let checkPlaylist = false;

    if (listOfPlaylist === undefined) {
        response.status(500);
        response.send(JSON.stringify({"status": 500, "error": errorMessage, "response": null}));
        //If there is error, we send the error in the error section with 500 status
    } else {
        for (let i = 0; i < listOfPlaylist.playlists.length; i++) {
            if (listOfPlaylist.playlists[i] == playlistID) {
                checkPlaylist = true;
            }
        }
        response.status(200);
        response.send(JSON.stringify({"status": 200, "error": null, "response": checkPlaylist}));
        //If there is no error, all is good and response is 200OK.
    }
});

module.exports = app;
