/* 
 * SERVER.JS - setup for server, modules, middleware, database
 */

// set up base express app
var express = require('express');
var app = express();

// other modules and middleware
var request = require('request');
var path = require('path');   // built-in module for dealing with file paths
var bodyParser = require('body-parser');  // parse form data into req.body
var mongoose = require('mongoose');   // object document mapper
// configure bodyparser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// connect to database
var dbName = 'drop-the-needle';
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/' + dbName);    

// serve public folder as static assets on the root route
var publicPath = path.join(__dirname, 'public');
app.use("/", express.static(publicPath));

// alias the views folder
// var viewsPath = path.join(__dirname, 'views');
// app.set('views', viewsPath);

// set 'html' as the engine, using ejs's renderFile function
var ejs = require('ejs');
app.engine('html', ejs.renderFile); 
app.set('view engine', 'html');

/*** ROUTES ***/
var routes = require('./routes');

// INDEX and TEMPLATE ROUTES
app.get('/', routes.index);
// app.get('/', function(request, response){
//   response.render('index');
// });

app.get('/templates/:name', routes.templates);
// app.get('/templates/:name', function(request, response){
//   var name = request.params.name;
//   response.render('templates/' + name);
// });

// API ROUTES
// post routes



// Spotify Query
app.post('/api/playlist/search', function(req,res) {
  console.log(req.body);
  var url = "https://api.spotify.com/v1/search?q=" + req.body.term + "&type=playlist";
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Show the HTML for the Google homepage. 
    }
    res.send(body);
  });
});

app.get('/get-tracks', function(req,res) {
  var url = 'https://api.spotify.com/v1/playlists/' + req.params.playlist_id +'/tracks';
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body); // Show the HTML for the Google homepage. 
    }
    res.send(body);
  });
});



// ALL OTHER ROUTES (ANGULAR HANDLES)
// redirect all other paths to index
app.get('*',  routes.index);


// SERVER
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 1337;

var server = require('http').createServer(app);
server = server.listen(port);
console.log(process.env.NODE_ENV  + ' server running at port:' + port);

