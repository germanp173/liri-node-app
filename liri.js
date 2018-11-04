// Import required node libraries.
var keys = require('./keys');
var inquirer = require('inquirer');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

var appCommands = {
    concert_this: 0,
    spotify_this_song: 1,
    movie_this: 2,
    do_what_it_says: 3
}

var liriQuestion = [
    {
        type: 'list',
        name: 'command',
        message: "What would you like LIRI to do?",
        choices: Object.keys(appCommands)
    }
];

function chooseCommand(){
    console.log('\n');
    inquirer.prompt(liriQuestion).then(response => {
        getCommandArgument(response.command);
    });
}

function getCommandArgument(command){
    var argName = 'arg';
    var commandEnum = appCommands[command];
    inquirer.prompt([
        {
            type: 'input',
            name: argName,
            message: 'What ARTIST do you want to search concerts for?',
            when: function(){
                return commandEnum === appCommands.concert_this;
            }
        },
        {
            type: 'input',
            name: argName,
            message: 'What SONG do you want to search for?',
            when: function(){
                return commandEnum === appCommands.spotify_this_song;
            }
        },
        {
            type: 'input',
            name: argName,
            message: 'What MOVIE do you want to search for?',
            when: function(){
                return commandEnum === appCommands.movie_this;
            }
        }
    ]).then(response => {
        console.log('\n');
        logger(`Command: ${command} | Arg: ${response.arg}`, true);
        processCommand(commandEnum, response.arg);
    });
} 

// Initial command to start the application.
console.log("\nWelcome to LIRI!");
chooseCommand();

// #################### Command Functions #################### //

function processCommand(command, arg){
    switch (command){
        case appCommands.concert_this:
            getConcert(arg);
            break;
        case appCommands.spotify_this_song:
            spotifySong(arg);
            break;
        case appCommands.movie_this:
            findMovie(arg);
            break;
        case appCommands.do_what_it_says:
            doRandom();
            break;
        default:
            logger(`Error - Invalid command given: ${command}`);
            chooseCommand();
    }
}

function getConcert(artist){
    // No default is set for artist. Command will simply end.
    if (artist === undefined || artist === ''){
        logger("No artist was given");
        return chooseCommand();
    }

    artist = artist.replace(' ', '+');
    var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    request(query, function(error, response, body){
        if (!error && response.statusCode === 200){
            // Ensure artist was found.
            if (body.toLowerCase().includes("warn=not found")){
                logger(`Error: '${artist}' was not found!`);
                return chooseCommand();
            }
            
            // API returns an array of concerts.
            var concerts = JSON.parse(body);

            // Ensure that artist has upcoming concerts.
            if (concerts.length > 0){
                concerts.forEach(function(concert){                    
                    logger(`Venue Name: ${concert.venue.name}`);
                    logger(`+ Location: ${concert.venue.city}, ${concert.venue.country}`);
                    logger(`+ Event Date: ${moment(concert.datetime).format("MM/DD/YYYY")}`);
                })

            } else {
                logger(`${artist.replace('+', ' ')} has no upcoming concerts :(`);
            }
        } else {
            logger("Error retriving concerts from API: " + error);
        }

        chooseCommand();
    });
}

function spotifySong(song){
    // Set default song if no song is defined.
    if (song === undefined || song === ''){
        song = "The Sign";
    }

    // Use Spotify API to search for song.
    spotify.search({
        type: 'track',
        query: song,
        limit: 20
    }, function(error, data){
        if (error){
            logger("Error occurred from Spotify API: " + error);
        } else {
            // Iterate through the top 20 tracks retrieved from the Spotify API and look for an exact match.
            var exactTrackFound = false;
            for (var i = 0; i < data.tracks.items.length; i++) {
                const track = data.tracks.items[i];
                if (track.name.toLowerCase() === song.toLowerCase()){
                    // Get all artists on the track by iterating through the artist array.
                    var artists = [];
                    track.artists.forEach(function(artist){
                        artists.push(artist.name);
                    });

                    // Publish info to the console.
                    logger(`Artist(s): ${artists.join(', ')}`);
                    logger(`Song Name: ${track.name}`);
                    logger(`Preview URL: ${(track.preview_url !== null ? track.preview_url:"Not Available")}`);
                    logger(`Album: ${track.album.name}`);

                    // Track was found...we can stop iterating.
                    exactTrackFound = true;
                    break;

                }
            }

            if (!exactTrackFound){
                logger(`'${song}' was not found. Are you sure you spelled it right?`);
            }
        }

        chooseCommand();
    });
}

function findMovie(movie){
    // Set default movie if no movie is provided.
    if (movie === undefined || movie === ''){
        movie = "Mr. Nobody";
    }

    // Create OMDB query.
    movie = movie.replace(" ", "+");
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body){
        // Check if the API returned any errors.
        if (!error && response.statusCode === 200){
            // Parse the json response and extract the data we're interested in.
            var movieJson = JSON.parse(body);

            // Ensure API actually found the movie.
            if (movieJson.Error){
                logger(movieJson.Error);
                return chooseCommand();
            }

            // Array of information we want to extract from the response body.
            var info = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors'];
            for (var key in movieJson){
                if (info.includes(key)){
                    logger(`${key}: ${movieJson[key]}`);
                }
            }

            // Now we want to get a rating from a specific source so we'll need to dig a little deeper to search for that.
            var ratingSource = "Rotten Tomatoes";            
            movieJson.Ratings.forEach(function(source){
                if (source.Source === ratingSource){
                    logger(`${ratingSource}: ${source.Value}`);
                }
            });
        } else {
            logger("Error getting movie from API: " + error);
        }

        chooseCommand();
    });
    
}

function doRandom(){
    var fileName = "random.txt";
    fs.readFile(fileName, "utf8", function(error, data){
        if (error){
            logger(`Failed to read ${fileName}: ${error}`);
        } else {
            // Split line from file into an array which contains the command and argument.
            var commandArr = data.split('"').join('').replace('\n', '').split(',');
            logger(`Text Command: ${commandArr}\n`);
            processCommand(appCommands[commandArr[0]], commandArr[1]);
        }
    });
}

function logger(text, logFileOnly){
    if (!logFileOnly){
        console.log(text);
    }
    
    fs.appendFile("log.txt", '\n' + text, 'utf8', (err) => {
        if (err){
            console.log("Failed to append data to log file");
        }
    });
}