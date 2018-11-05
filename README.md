# LIRI Node Application

LIRI is a Language Interpretation and Recognition Interface command line node application.

Use LIRI to search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

LIRI accepts the followings commands:

* **concert_this** - search for upcoming concerts of a given artist
* **spotify_this_song** - search Spotify for information about a song
* **movie_this** - search OMDB for information about a movie
* **do_what_it_says** - extracts a command and argument from a text file and executes it

## Table of Contents

1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    2. [Installing](#installing)
2. [Run](#run)
3. [Examples](#examples)
    1. [concert_this](#concert_this)
    2. [spotify_this_song](#spotify_this_song)
    3. [movie_this](#movie_this)
    4. [do_what_it_says](#do_what_it_says)
4. [Built With](#built-with)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following:

* [Node](https://nodejs.org/en/) installed
* Spotify Client ID and Client Secret
  * Don't have these? Follow the instructions found at the bottom of the page [here](https://www.npmjs.com/package/node-spotify-api)

### Installing

Following these instructions step by step to get a development env running:

1. Clone this repository
2. Create a `.env` file at the root of your local repo
3. Add the following to the `.env` file and replace the values with your Spotify API keys:

```
SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret
```

4. From the root of your repo, run `npm install`
    * This will install all application dependencies specified in the `package.json`

## Run

To run LIRI simply run the following command at the root of the repo:

```
node liri.js
```

Once you start LIRI, you'll be able to select from the available commands like so:

![Start Image](/images/start-liri.png)

## Examples

### concert_this

* Select the `concert_this` command and type in your favorite artist to check out what concerts they have coming up!
* The venue name, location and date of each concert will be shown

![Concert This](/images/concert-this.gif)

* If the artist has no upcoming concerts, you'll get this:

![Concert This None](/images/concert-this-none.gif)

* If you type in an unknown artist, you'll get this:

![Concert This Error](/images/concert-this-error.gif)

### spotify_this_song

* Select the `spotify_this_song` command and type in a song you want info on!

![Spotify This](/images/spotify-this-song.gif)

* If you type in an unknown song, you'll get this:

![Spotify This Error](/images/spotify-this-song-error.gif)

### movie_this

* Select the `movie_this` command and type in a movie you want info on!

![Movie This](/images/movie-this.gif)

* If you type in an unknown movie, you'll get this:

![Movie This Error](/images/movie-this-error.gif)

### do_what_it_says

* The `do_what_it_says` command will run the command and argument specified in the `random.txt` file
* In the example below, the `random.txt` file contains the following text:

```
spotify_this_song,"I Want it That Way"
```

![Random Spotify](/images/random-spotify.gif)

* As another example, the `random.txt` file here contains the following text:

```
movie_this,"Shutter Island"
```

![Random Movie](/images/random-movie.gif)

## Built With

* [Node](https://nodejs.org/en/) - The framework used