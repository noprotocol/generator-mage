'use strict';

var fs = require('fs'),
  express = require('express'),
  mongoose = require('mongoose'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  passport = require('passport');

var subdomains = require('express-subdomains');

// subdomains
//   .use('api')

var morgan = require('morgan');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./api/config/config');

var server            = express();

server.use(subdomains.middleware);

// Only do this for non-production
if(env === 'development') {
  server.use(require('connect-livereload')());
}

server.use(bodyParser.json()); // parse application/json
server.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
server.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

server.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
server.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

server.use(passport.initialize());
server.use(passport.session());

server.use(function(req, res, next) {
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Access-Token, X-Requested-With, Cookie, Set-Cookie, Accept, Access-Control-Allow-Credentials, Origin, Content-Type, Request-Id , X-Api-Version, X-Request-Id');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
  res.header('Allow', req.headers['access-control-request-method']);
  return next();
});

console.log('Connecting to DB:', config.db);
mongoose.connect(config.db);

(function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
})(__dirname + '/api/models');

var auth = require('./api/config/middlewares/authorization');
require('./api/config/passport')(passport);
require('./api/config/routes')(server, passport, auth);

server.use(morgan('tiny'))

server.all('/*', function(req, res) {
  res.sendfile('index.html', { root: 'public' });
});

if(!module.parent) {
  server.listen(config.port, function() {
    console.log('Express listening at %s', config.port);
  });
}

exports = module.exports = server;
