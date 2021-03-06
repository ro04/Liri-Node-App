var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');

//Make it so liri.js can take in one of the following commands:
var nodeArgs = process.argv;
var commandLine = nodeArgs[2];
var  strArgs = "";
// Capture all the words in the commandLine (again ignoring the first two Node arguments)
for (var i = 3; i < nodeArgs.length; i++){
    strArgs = strArgs + nodeArgs[i] + " ";
};

//This will show your last 20 tweets and when they were created at in your terminal/bash window.
function myTweets() {
    var keys = require("./keys");
    var myTwitter = new Twitter(keys.twitterKeys);
    
    var params = {
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

                //***** TweetFile to write to log.txt *****//
                var tweetFile = "\n=======" + "\nTweets: " + tweets[i].text + 
                                "\nPosted: " + tweets[i].created_at;

                fs.appendFile('log.txt', tweetFile, function(err){
                    if(err){
                        console.log("Error: " + err);
                        return;
                    }
                });
            };
        };
    };
}//end myTweets()

//Show the following information: 
//Artist, The song's name, A preview link of the song from spotify, and The album that the song is from
function mySpotify() {
    var song = "";
    song = strArgs.replace(/ /g, '+');
    song = (song.slice(0,-1) + '');

    //if no song is provided then default to "The Sign" by Ace of Base
    if(song === ""){
        spotify.search({ type: 'track', query: "The Sign" }, defaultHollaback);
    }else{
        spotify.search({ type: 'track', query: song }, hollaback);
    };

    function hollaback(err, data) {
        if(err){
            console.log('error:', error); // Print the error if one occurred 
            return;
        }else{ 
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Spotify Link: " + data.tracks.items[0].artists[0].external_urls.spotify);
            console.log("Album: " + data.tracks.items[0].album.name);

            //***** spotifyFile to write to log.txt *****//
            var spotifyFile = "\n=======" + "\nArtist: " + data.tracks.items[0].artists[0].name + 
                                "\nSong: " + data.tracks.items[0].name + 
                                "\nSpotify Link: " + data.tracks.items[0].artists[0].external_urls.spotify +
                                "\nAlbum: " + data.tracks.items[0].album.name;

            fs.appendFile('log.txt', spotifyFile, function(err){
                if(err){
                    console.log("Error: " + err);
                    return;
                }
            });
        };
    };

    function defaultHollaback(error, data){
        for(var i = 0; i < data.tracks.items.length; i++){
            if(data.tracks.items[i].artists[0].name == "Ace of Base"){  
                console.log(data.tracks.items[i].artists[0].name);
                console.log(data.tracks.items[i].name);
                console.log(data.tracks.items[i].artists[0].external_urls.spotify);
                console.log(data.tracks.items[i].album.name);

                //***** TweetFile to write to log.txt *****//
                var spotifyFile = "\n=======" + "\nArtist: " + data.tracks.items[0].artists[0].name + 
                                    "\nSong: " + data.tracks.items[0].name + 
                                    "\nSpotify Link: " + data.tracks.items[0].artists[0].external_urls.spotify +
                                    "\nAlbum: " + data.tracks.items[0].album.name;

                fs.appendFile('log.txt', spotifyFile, function(err){
                    if(err){
                        console.log("Error: " + err);
                        return;
                    }
                });
            };
        };
    };
};//end mySpotify()

//This will output the following information to your terminal/bash window:
//Title of the movie, Year the movie came out, IMDB Rating of the movie,
//Country where the movie was produced, Language of the movie, Plot of the movie,
//Actors in the movie, and Rotten Tomatoes rating.
function myMovie() {
    var title = "";
    title = strArgs.replace(/ /g, '+');
    title = (title.slice(0,-1) + '');

    //if the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
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
            //console.log('statusCode:', response && response.statusCode); 
            // Print the response status code if a response was received 
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
		    console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Actors: " + JSON.parse(body).Actors);
		    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);

            //***** TweetFile to write to log.txt *****//
            var movieFile = "\n=======" + "\nTitle: " + JSON.parse(body).Title + 
                            "\nRelease Year: " + JSON.parse(body).Year + 
                            "\nIMBD Rating: " + JSON.parse(body).imdbRating+
                            "\nCountry: " + JSON.parse(body).Country +
                            "\nLanguage: " + JSON.parse(body).Language +
                            "\nPlot: " + JSON.parse(body).Plot +
                            "\nActors: " + JSON.parse(body).Actors +
                            "\nRotten Tomatoes: " + JSON.parse(body).Ratings[1].Value;

            fs.appendFile('log.txt', movieFile, function(err){
                if(err){
                    console.log("Error: " + err);
                    return;
                }
            });
        };
    });
};//end myMovie()

//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
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











