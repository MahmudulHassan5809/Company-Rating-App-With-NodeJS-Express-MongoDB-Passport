const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');


//Load User Model
const User = require('../models/User');

const keys = require('./secret');

module.exports = function(passport){
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      //console.log(profile);

     //console.log(image);
      const newUser = {
        googleID: profile.id,
        fullname: profile.name.givenName,
        email: profile.emails[0].value,
      }

      // Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  )

   passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

}

