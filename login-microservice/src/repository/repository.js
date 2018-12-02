var mongoose = require('mongoose');
var User = require('../models/user');

function findAll(callback){
    User.find((err, people) => {
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        if (err) return res.status(500).send(err)
        // send the list of all people
        return res.status(200).send(people);
    });
}

/*

// get all the users 
// FIND ALL
User.findAll({}, function(err, users) {
    if (err) throw err;
  
    // object of all the users
    console.log(users);
  });


// get the user starlord55 
// FIND ONE
User.find({ username: 'starlord55' }, function(err, user) {
    if (err) throw err;
  
    // object of the user
    console.log(user);
  });


  // get a user with ID of 1 
  // FIND BY ID
User.findById(1, function(err, user) {
    if (err) throw err;
  
    // show the one user
    console.log(user);
  });



// find the user starlord55
// update him to starlord 88
User.findOneAndUpdate({ username: 'starlord55' }, { username: 'starlord88' }, function(err, user) {
    if (err) throw err;
  
    // we have the updated user returned to us
    console.log(user);
  });



  // find the user with id 4
// update username to starlord 88
User.findByIdAndUpdate(4, { username: 'starlord88' }, function(err, user) {
    if (err) throw err;
  
    // we have the updated user returned to us
    console.log(user);
  });



  // get the user starlord55
User.findAndRemove({ username: 'starlord55' }, function(err, user) {
    if (err) throw err;
  
    // delete him
    user.remove(function(err) {
      if (err) throw err;
  
      console.log('User successfully deleted!');
    });
  });


  // find the user with id 4
User.findOneAndRemove({ username: 'starlord55' }, function(err) {
    if (err) throw err;
  
    // we have deleted the user
    console.log('User deleted!');
  });



  // find the user with id 4
User.findByIdAndRemove(4, function(err) {
    if (err) throw err;
  
    // we have deleted the user
    console.log('User deleted!');
  });

  */
module.exports = { findAll }//, find, findById, findOneAndUpdate, findByIdAndUpdate, findAndRemove, findOneAndRemove, findByIdAndRemove }
