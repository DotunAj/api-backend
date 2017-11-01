
// Load up stuffs
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


mongoose.connection.openUri('mongodb://localhost/nodesr')
mongoose.Promise = require('bluebird');
let db = mongoose.connection;

// Check for connection to be and prompt
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for db errors
db.on('error', function(err){
    console.log(err);
});

// Initializing app
const app = express();

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname,'public')));

//Bringing in the models
let Resource = require('./models/resource');

// Setting view to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Home route
app.get('/', function(req, res){
    Resource.find({}, function(err, resources){
        if(err){
            console.log(err);
        }else{
            res.render('pages/home', {
                title:'Resource',
                resources:resources
            });
        }
    });
    
});

// Add Resource route
app.get('/resource/add', function(req, res){
    res.render('pages/add_resource', {
        title:'Add Resource'
    });
});

// Add Submit POST route
app.post('/resource/add', function(req, res){
    let resource = new Resource();
    resource.title = req.body.title;
    resource.author = req.body.author;
    resource.body = req.body.body;

    resource.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });

});

// Start Server
app.listen(4000, function(){
    console.log('Server started on port 3000..')
});