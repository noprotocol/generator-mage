'use strict';

var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  Session = mongoose.model('Session'),
  User = mongoose.model('User');

module.exports = function (passport) {

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    // done(null, user.id);
    var createAccessToken = function () {
      var token = user.generateRandomToken();
      Session.findOne({ accessToken : token }, function (err, existingToken) {
        if(err) { return done(err); }
        if(existingToken) {
          createAccessToken();
        } else {
          var session = new Session();
          session.set('userId', user._id);
          session.set('accessToken', token);
          session.save(function(err) {
            if(err) { return done(err); }
            user.accessToken = token;
            return done(null, user);
          });
        }
      });
    };

    if ( user._id ) {
      createAccessToken();
    }

  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user);
    });
  });

  // Local Strategy
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      });
    }
  ));


};
