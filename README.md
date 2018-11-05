# LIRI Node Application

A Language Interpretation and Recognition Interface (LIRI) command line node application.

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
2. [Examples](#examples)
    1. [concert_this](#concert_this)
    2. [spotify_this_song](#spotify_this_song)
    3. [movie_this](#movie_this)
    4. [do_what_it_says](#do_what_it_says)
3. [Run](#run)
4. [Acknowledgments](#acknowledgments)

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

Once you start LIRI, you'll be able to select the available commands:

![Alt text](./assets/start-liri.png)

## Examples

### concert_this

* **spotify_this_song**
* Testing

### spotify_this_song

### movie_this

### do_what_it_says

## Built With

* [Node](https://nodejs.org/en/) - The framework used

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc