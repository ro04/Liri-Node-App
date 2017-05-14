var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var 
//Make it so liri.js can take in one of the following commands:
var nodeArgs = process.argv;
var commandLine = nodeArgs[2];
var  strArgs = "";
// Capture all the words in the commandLine (again ignoring the first two Node arguments)
for (var i = 3; i < nodeArgs.length; i++){
    strArgs = strArgs + nodeArgs[i] + " ";
};
//console.log(strArgs);

function myTweets() {
    var keys = require("./keys");
    var myTwitter = new Twitter(keys.twitterKeys);
    //console.log(keys.twitterKeys);
    var params = {
        //q: '@pippy_lepew',
        screen_name: 'pippy_lepew',
        count: 20
    };

    myTwitter.get('statuses/user_timeline', params, callback);

    function callback(err, tweets, response) {
        if(err){
            console.log('Error occured: ' + err);
            return;
        }else{
            for (var i = 0; i < tweets.length; i++){
                console.log("=======");
                console.log("Tweets: "  + tweets[i].text);
                console.log("Posted: " + tweets[i].created_at);

                fs.appendFile('log.txt', logString, function(err){
                    if(err) throw err;
                });
            };
        };
    };
}//end myTweets()

function mySpotify() {
    var song = "";
    song = strArgs.replace(/ /g, '+');
    song = (song.slice(0,-1) + '');
    console.log(song);

    //if no song is provided then default to "The Sign" by Ace of Base
    if(song === ""){
        spotify.search({ type: 'track', query: "The Sign" }, defaultHollaback);
    }else{
        spotify.search({ type: 'track', query: song }, hollaback);
    }
    //Show the following information: 
    //Artist, The song's name, a preview link of the song from spotify, 
    //and the album that the song is from
    function hollaback(error, data) {
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].artists[0].external_urls.spotify);
        console.log(data.tracks.items[0].album.name);
    };

    function defaultHollaback(error, data){
        for(var i = 0; i < data.tracks.items.length; i++){
            if(data.tracks.items[i].artists[0].name == "Ace of Base"){
                console.log(data.tracks.items[i].artists[0].name);
                console.log(data.tracks.items[i].name);
                console.log(data.tracks.items[i].artists[0].external_urls.spotify);
                console.log(data.tracks.items[i].album.name);
            };
        };
    };
};//end mySpotify()

function myMovie() {
    var title = "";
    title = strArgs.replace(/ /g, '+');
    title = (title.slice(0,-1) + '');

    if(title === ""){
        var queryURL = "https://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&r=json";
    }else{
        var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json";
    }

    request(queryURL, function (err, response, body) {
        if(err){
             console.log('error:', error); // Print the error if one occurred 
             return;
        }else if(response.statusCode === 200) {
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
        };
    });
};//end myMovie()

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf-8', function(err, data){
        var length = data.length;
        var pos = data.indexOf(',');
        str = data.slice(0,pos); 
        strArgs = data.slice(pos+2, length);
        if(str === 'spotify-this-song'){
            mySpotify();
        }
    });
};


switch(commandLine){
    case "my-tweets":
        //This will show your last 20 tweets and
        //when they were created at in your terminal/bash window
        myTweets();
        break;
    case 'spotify-this-song':
        mySpotify(); 
        break;
    case 'movie-this':
        myMovie();
        break;
    case 'do-what-it-says':
        doWhatItSays();
};// end switch











