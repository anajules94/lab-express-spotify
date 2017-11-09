const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.set('layout', __dirname + '/views/layout/main-layout');
// app.use(expressLayouts);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));


// Remember to paste here your credentials
var clientId = 'eaf7c7bd461c47ba93c0c30e889316f6',
  clientSecret = 'd36f4c7844ca44d0babbd3428585cf03';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artists', (req, res) => {
  let artistSearch = req.query.artist;
  //crea una promesa te voy a pasar en esta funcion una objeto que se llama data
  spotifyApi.searchArtists(artistSearch)
    .then(function(data) {
      let artistsArray = data.body.artists.items;
      res.render('artists', {
        artists: artistsArray
      }) // render es un metodo de la respuesta que te da el servidor
    })
});


// : --> es variable (Lo que sea) /id especifica ruta
// get artist albums
app.get('/artist/:id', (req, res) => {
  let artistId = req.params.id;
  spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
      res.render('artist', {
        albums: data.body.items
      }) // render es un metodo de la respuesta que te da el servidor
    }, function(err) {
      console.error(err);
    });
});

//get tracks in an album
app.get('/album/:id', (req, res) => {
  let albumId = req.params.id;
  spotifyApi.getAlbumTracks(albumId)
  .then((data) => {
    console.log(data.body.items);
    res.render('album', {tracks: data.body.items})
  })

  // }, function(err) {
  //   console.log(err);
  // });
});

app.listen(3000);
