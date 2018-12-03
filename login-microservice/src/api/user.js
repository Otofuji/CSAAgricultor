var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/usuarios");
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
            return res.json({user: user.toAuthJSON()}); //Devolve o token de autenticação do usuario
        }).catch(next);
    }); //Rota testada e funcionando com o banco de dados teste que eu criei

    //Caso o usuario esteja logado, ele pode ver suas informações por este request
    app.get('/user', auth.required, function(req,res,next){
        User.findById(req.payload.id).then(function(user){
            if(!user){return res.sendStatus(401);}
            return res.json({user: user.toAuthJSON()});
        }).catch(next);
    });
    
    //Login Funcionando
    app.post('/users/login', function(req,res,next){
        if(!req.body.user.email){
            return res.status(422).json({errors: {email: "can't be blank."}});
        }
        if(!req.body.user.password){
            return res.status(422).json({errors: {password: "can't be blank."}});
        }
        passport.authenticate('local', {session: false}, function(err, user, info){ //Comparação do email com a senha
            if(err){return next(err);}
            if(user){
                user.token = user.generateJWT();
                return res.json({user: user.toAuthJSON()}); //Devolve o token de autenticação do usuario
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

    app.get('/autocomplete/:input', function(req, res) {
      var fs = require('fs');
      var request = require('request');
      request('http://www.mocky.io/v2/5c05818c3300006f00e812c2', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        var input = req.params.input;
        var db = JSON.parse(body);
        var cultivo = [];
        for (var i = 0; i < db.length; i++){
          cultivo.push(db[i].cultivo);
        }
        var stringSimilarity = require('string-similarity');
        var matches = stringSimilarity.findBestMatch(input, cultivo);
        res.send(matches);
        
});
  
});

}













