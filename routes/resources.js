const express = require('express');
const router = express.Router();


//Bringing in Resource model
let Resource = require('../models/resource');

//Bringing in User model
let User = require('../models/user');

// Add Resource route
router.get('/add', ensureAuthenticated, function(req, res){
    const errors = false
    res.render('pages/add_resource', {
        title:'Add Resource',
        errors:errors
    });
});

// Add Submit POST route
router.post('/add',ensureAuthenticated, function(req, res){
    req.checkBody('title', 'Title is required').notEmpty();
    //req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('pages/add_resource', {
            user:user=true,
            title:'Add Resource',
            errors:errors,
        });
    }else{
        let resource = new Resource();
        resource.title = req.body.title;
        resource.author = req.user.username;
        resource.body = req.body.body;
    
        resource.save(function(err){
            if(err){
                console.log(err);
            }else{
                req.flash('success', 'Resource Added');
                res.redirect('/dashboard');
            }
        });
    }

});





// Load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Resource.findById(req.params.id, function(err, resource){
        if(resource.author != req.user.username){
            req.flash('realDanger', 'Not Authorized');
            res.redirect('/dashboard');
        }
        console.log(resource)
        res.render('pages/edit_resource', {
            title:'Edit ' + resource.title,
            resource:resource
        }); 
        return;
    });
});

// Update Submit POST route
router.post('/edit/:id', function(req, res){
    let resource = {};
    resource.title = req.body.title;
    resource.author = req.user.username;
    resource.body = req.body.body;

    let query = {_id:req.params.id}

    Resource.update(query, resource, function(err){
        if(err){
            console.log(err);
        }else{
            req.flash('success', 'Resource Updated');
            res.redirect('/dashboard');
        }
    });

});

//Delete Article
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Resource.findById(req.params.id, function(err, resource){
        if(resource.author != req.user.username){
            res.status(500).send();
        } else{
            Resource.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
                
            });
        }
    })

    
});

// Get single resource
router.get('/:id', function(req, res){
    Resource.findById(req.params.id, function(err, resource){
        res.render('pages/resource', {
            resource:resource
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('realDanger', 'Please login');
        res.redirect('/users/login')
    }
}

module.exports = router;