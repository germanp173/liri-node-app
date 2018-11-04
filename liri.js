// Import required node libraries.
var keys = require('./keys');
var inquirer = require('inquirer');
var request = require('request');
var moment = require('moment');
var fs = require('fs');

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
        getCommandArgument(appCommands[response.command]);
    });
}

function getCommandArgument(command){
    var argName = 'arg';
    inquirer.prompt([
        {
            type: 'input',
            name: argName,
            message: 'Name the ARTIST you want to search concerts for',
            when: function(){
                return command === appCommands.concert_this;
            }
        },
        {
            type: 'input',
            name: argName,
            message: 'What SONG do you want to search for?',
            when: function(){
                return command === appCommands.spotify_this_song;
            }
        },
        {
            type: 'input',
            name: argName,
            message: 'What MOVIE do you want to search for?',
            when: function(){
                return command === appCommands.movie_this;
            }
        }
    ]).then(response => {
        console.log('\n');
        processCommand(command, response.arg);
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
            console.log(`Error - Invalid command given: ${command}`);
    }
}

function getConcert(artist){
    // No default is set for artist. Command will simply end.
    if (artist === undefined || artist === ''){
        console.log("No artist was given");
        return chooseCommand();
    }

    artist = artist.replace(' ', '+');
    var query = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

    request(query, function(error, response, body){
        if (!error && response.statusCode === 200){
            // API returns an array of concerts.
            var concerts = JSON.parse(body);

            // Ensure that artist has upcoming concerts.
            if (concerts.length > 0){
                concerts.forEach(function(concert){                    
                    console.log(`Venue Name: ${concert.venue.name}`);
                    console.log(`+ Location: ${concert.venue.city}, ${concert.venue.country}`);
                    console.log(`+ Event Date: ${moment(concert.datetime).format("MM/DD/YYYY")}`);
                    console.log("-");
                })

            } else {
                console.log(`${artist.replace('+', ' ')} has no upcoming concerts :(`);
            }
        } else {
            console.log("Error retriving concerts: " + error);
        }

        chooseCommand();
    });
}

function spotifySong(){
    // TODO
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
            // Array of information we want to extract from the response body.
            var info = ['Title', 'Year', 'imdbRating', 'Country', 'Language', 'Plot', 'Actors'];

            // Parse the json response and show the user the data of interest.
            var movieJson = JSON.parse(body);
            for (var key in movieJson){
                if (info.includes(key)){
                    console.log(`${key}: ${movieJson[key]}`);
                }
            }

            // Now we want to get a rating from a specific source so this will dig a little deeper to search for that.
            var ratingSource = "Rotten Tomatoes";            
            movieJson.Ratings.forEach(function(source){
                if (source.Source === ratingSource){
                    console.log(`${ratingSource}: ${source.Value}`);
                }
            });
        } else {
            console.log("Error getting movie: " + error);
        }

        chooseCommand();
    });
}

function doRandom(){
    var fileName = "random.txt";
    fs.readFile(fileName, "utf8", function(error, data){
        if (error){
            console.log(`Failed to read ${fileName}: ${error}`);
        } else {
            // Split line from file into an array which contains the command and argument.
            var commandArr = data.split('"').join('').replace('\n', '').split(',');
            console.log(`Text Command: ${commandArr}\n`);
            processCommand(appCommands[commandArr[0]], commandArr[1]);
        }
    });
}