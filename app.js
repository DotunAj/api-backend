
// Load up stuffs
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');



mongoose.connection.openUri(config.database);
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



// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

// Setting view to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Passport config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//Bringing in the models
let Resource = require('./models/resource');


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

// Dashboard route
app.get('/dashboard', function(req, res){
    Resource.find({}, function(err, resources){
        if(err){
            console.log(err);
        }else{
            res.render('pages/dashboard', {
                title:'Resource',
                resources:resources
            });
        }
    });
    
});

// Route Files
let resources = require('./routes/resources');
let users = require('./routes/users');
app.use('/resources', resources);
app.use('/users', users);

// Start Server
app.listen(4000, function(){
    console.log('Server started on port 4000..')
});