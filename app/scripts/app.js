'use strict';

/**
 * @ngdoc overview
 * @name countriesCapitalsApp
 * @description
 * # countriesCapitalsApp
 *
 * Main module of the application.
 */
angular
  .module('countriesCapitalsApp', [
    'ngAnimate',
    'ngMessages',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
