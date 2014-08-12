'use strict';

var app = angular.module('myApp', ['ui.router', 'ngResource', 'ngCookies']);

app.config(function($locationProvider, $stateProvider, $httpProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider

    .state('main', {
      views: {
        '': {
          templateUrl: '/views/layouts/main.html'
        }
      }
    })
    .state('main.home', {
      url: '/',
      views: {
        'contents':   { controller: 'HomeCtrl', templateUrl: '/views/home.html' }
      }
    });

    $httpProvider.interceptors.push(function ($q) {
      return {
        'response': function (response) {
          return response;
        },
        'responseError': function (rejection) {
          if(rejection.status === 401) {
          }
          return $q.reject(rejection);
        }
      };
    });

});

app.constant('ENV', {
  'apiEndpoint': '/api/'
});

app.run(function($state) {
  console.log($state);
});
