var mongoose = require('mongoose');
var router = require('express').Router();
var auth = require('../routes/auth');
var User = require('../models/user')
var passport = require('passport');


module.exports = (app, repository) => {

    //POST new user route (optional, everyone has access)
    app.post('/users', auth.optional, function(req,res,next){
        var user = new User();
        user.username = req.body.user.username;
        user.email = req.body.user.email;
        user.setPassword(req.body.user.password);
        user.save().then(function(){
            return res.json({user: user.toAuthJSON()});
        }).catch(next);
    });

    app.get('/user', auth.required, function(req,res,next){
        User.findById(req.payload.id).then(function(user){
            if(!user){return res.sendStatus(401);}
            return res.json({user: user.toAuthJSON()});
        }).catch(next);
    });
    
    app.post('/users/login', function(req,res,next){
        if(!req.body.user.email){
            return res.status(422).json({errors: {email: "can't be blank."}});
        }
        if(!req.body.user.password){
            return res.status(422).json({errors: {password: "can't be blank."}});
        }
        passport.authenticate('local', {session: false}, function(err, user, info){
            if(err){return next(err);}
            if(user){
                user.token = user.generateJWT();
                return res.json({user: user.toAuthJSON()});
            } else {
                return res.status(422).json(info);
            }
        })(req,res,next)
    });
    
    app.use(function(err,req,res,next){
        if(err.name === 'ValidationError'){
            return res.json({
                errors: Object.keys(err.errors).reduce(function(errors ,key){
                    errors[key] = err.errors[key].message;
                    return errors;
                }, {})
            })
        }
        return next(err);
    });

}













