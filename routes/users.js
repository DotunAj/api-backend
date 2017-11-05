const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bringing in User model
let User = require('../models/user');


// Register Form
router.get('/register', function(req, res){
    const errors = false;
    const user = false;
    res.render('pages/register',{
        errors:errors,
        user:user
    });
});

//Register Proccess
router.post('/register', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('pages/register',{
            user:user=false,
            errors:errors
        });
    }
    else{
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }
                    else{
                        req.flash('success','You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        })
    }
})

// Login Form
router.get('/login', function(req, res){
    
    res.render('pages/login');
});

//Login process
router.post('/login', function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash: true,
        successFlash: 'Welcome!'
    })(req, res, next);
});




//Logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login')
});

//Delete Article
router.delete('/:id', function(req, res){
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    User.findById(req.params.id, function(err, user){
        if(user.username != req.user.username){
            res.status(500).send();
        } else{
            User.remove(query, function(err){
                if(err){
                    console.log(err);
                }
                res.send('Success');
                
            });
        }
    });
});

module.exports = router;