
// Load up stuffs
const express = require('express');
const path = require('path');

const app = express();

// Setting view to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.get('/', function(req, res){
    res.render('index', {
        title:'Hello World'
    });
});

app.listen(3000, function(){
    console.log('Server started on port 3000..')
});