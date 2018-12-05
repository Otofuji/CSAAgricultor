var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/usuarios");
var router = require('express').Router();
var auth = require('../routes/auth');
var User = require('../models/user')
var passport = require('passport');
var isISODate = require( 'is-iso-date' );
var MongoClient = require('mongodb').MongoClient;



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

    app.get('/users/autocomplete/:input', function(req, res) {
      var fs = require('fs');
      var request = require('request');
      request('http://www.mocky.io/v2/5c05b09c3300006f00e8132d', function (error, response, body) {
        var input = req.params.input;
        var db = JSON.parse(body);
        
        var cultivo = [];
        for (var i = 0; i < db.length; i++){
          cultivo.push(db[i].cultivo);
        }
        var stringSimilarity = require('string-similarity');
        var matches = stringSimilarity.findBestMatch(input, cultivo);
        
        if(matches.bestMatch.rating >= 0.5){
            res.send(matches.bestMatch.target);

        }
        else {
            res.send(input)
        }
        
});
  
});

    // Corrigir datas que entram aqui e retornar elas corrigidas pro 'res'
    app.get('/inputs/dates/get_validate_date_format', function(req, res) {
        var date_to_fix = req.params.dates;

        if (! isISODate( date_to_fix ) ){
            try {
                var fixed_date = new Date(date_to_fix).toISOString()
                res.status(200).send(fixed_date)
            } catch {
                console.log("O formato da data recebida nao foi reconhecido pelo parser de data, é necessario mudar o formato da data.");
                console.error(error);
                res.status(400)
            }
        } else {
            var fixed_date = date_to_fix
        }

        res.status(200).send(date_to_fix)
    });

    // Corrigir datas que entram aqui e retornar elas corrigidas pro 'res'
    app.get('/inputs/dates/get_current_date', function(req, res) {
        
        var date = new Date().toISOString()
        res.status(200).send(date)
    
    });

    // Corrigir datas que entram aqui e retornar elas corrigidas pro 'res'
    app.get('/inputs/dates/fix_date_in_json_and_append_into_database', function(req, res) {
        information = JSON.parse(req.params.info)
        var date_to_fix = information.date;

        if (! isISODate( date_to_fix ) ) {
            try {
                var fixed_date = new Date(date_to_fix).toISOString()
            } catch {
                console.log("O formato da data recebida nao foi reconhecido pelo parser de data, é necessario mudar o formato da data.");
                console.error(error);
                res.status(400)
            }
        } else {
            var fixed_date = date_to_fix
        }

        information.date = fixed_date

        try {
            MongoClient.connect("mongodb://DATABASE-ADDRESS/DATABASE-NAME", function (err, db) {
                    
                db.collection('COLLECTION-NAME', function (err, collection) {
                    
                    collection.insert(information) {
                        res.send(
                            (err === null) ? { msg: '' } : { msg: err }
                        );
                    };
                });             
            });

            res.status(200);

        } catch {
            console.error(error);
            res.status(400);
        };
    });

    // Corrigir datas que entram aqui e retornar elas corrigidas pro 'res'
    app.get('/inputs/dates/append_current_date_into_json_into_database', function(req, res) {

        information = JSON.parse(req.params.info)
        
        var date = new Date().toISOString()

        information.date = date

        try {
            MongoClient.connect("mongodb://DATABASE-ADDRESS/DATABASE-NAME", function (err, db) {
                    
                db.collection('COLLECTION-NAME', function (err, collection) {
                    
                    collection.insert(information) {
                        res.send(
                            (err === null) ? { msg: '' } : { msg: err }
                        );
                    };
                });             
            });

            res.status(200);

        } catch {
            console.error(error);
            res.status(400);
        };
    
    });

    /////////////////////////////////////////////// MANDALA /////////////////////////////////////////////////////////////

    // Corrigir datas que entram aqui e retornar elas corrigidas pro 'res'
    app.get('/mandala/get_mandala_info_to_front', function(req, res) {

        MongoClient.connect("mongodb://DATABASE-ADDRESS/DATABASE-NAME", function (err, db) {
                
            db.collection('COLLECTION-NAME', function (err, collection) {
                
                var information = JSON.parse(collection.get('mandala'));
            });             
        });

        res.status(200).send(information);

    });

}













