var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config').secret;


//Garante que não tenha mais de um usuario com o mesmo nome
var UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
  email: {type: String, unique: true, required: [true, "cannot be empty."], lowercase: true, index: true},
  bio: String,
  image: String,
  salt: String,
  hash: String
}, {timestamps: true});


//Garante que não tenha mais de um usuario com o mesmo nome
 UserSchema.plugin(uniqueValidator, {message: 'is already taken.'}); //essa função já aplica o plugin no schema

 //Criando métodos para o usuário
 //Hash salt passwords
 UserSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };

  //Método para validar a senha
  UserSchema.methods.validPassword = function(password) {
     var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
     return this.hash === hash;
    };

  //Método para gerar o JWT do usuário
  UserSchema.methods.generateJWT = function() {
      var today = new Date();
      var exp = new Date(today);
      exp.setDate(today.getDate() + 60); //determina quando o token expira
    
      return jwt.sign({
        id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
      }, secret);
    };

    //Método para pegar o JSON do usuario pra autenticação
    UserSchema.methods.toAuthJSON = function(){
        return {
          username: this.username,
          email: this.email,
          token: this.generateJWT(),
          bio: this.bio,
          image: this.image
        };
      };

module.exports = mongoose.model('User', UserSchema);

