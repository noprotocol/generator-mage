'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Session = mongoose.model('Session');

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {

  if (!req.isAuthenticated()) {
    // Check if we have a valid token instead
    Session.findOne({ accessToken: req.headers['access-token'] }, function (err, session) {
      if (err || !session) {
        res.send(401);
      } else {
        // Find the user
        User.findOne({ _id: session.get('userId') }, function(err, user) {
          if(err || !user) {
            res.send(401);
          } else {
            req.user = user;
            next();
          }
        });
      }
    });
  } else {
    next();
  }
};

/*
 *  User authorizations routing middleware
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.redirect('/users/'+req.profile.id);
    }
    next();
  }
};
