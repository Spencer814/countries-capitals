angular.module('CCApp', ['ngRoute', 'ngAnimate'])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl : 'home.html',
        controller : 'homeCtrl'
    }).when('/countries', {
        templateUrl : './views/countries.html',
        controller : 'countriesCtrl'
    }).when('/countries/:country/capital', {
        templateUrl : './views/capital.html',
        controller : 'capitalCtrl'
    }).otherwise({
        redirectTo : '/'
    });
}])
    .run(function($rootScope, $location, $timeout) {
        $rootScope.$on('$routeChangeError', function() {
            $location.path("/error");
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
          $timeout(function() {
            $rootScope.isLoading = false;
          }, 1000);
        });
    })
    .controller('homeCtrl', function($scope) {
        // empty for now
    })
    .controller('countriesCtrl', function($scope) {
        // empty for now
    });
    .controller('capitalCtrl', function($scope) {
        // empty for now
    });
