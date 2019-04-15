const LoacalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');



//Load User model
const User = require('../models/User');


module.exports = function(passport){
  passport.use(new LoacalStrategy({usernameField: 'email',passwordField: 'password',passReqToCallback : true}, (req,email,password,done) => {
     console.log(email);

     //Match user
     User.findOne({
         email:email
     }).then(user => {
         if(!user){
           return done(null , false , req.flash('loginMessage','No User Found'));
         }

         //Match Password
         if(!user.comparePassword(password)){
             return done(null,false, req.flash('loginMessage','Password Does Not Match'));
         }

         return done(null,user);
     })
  }));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
}



