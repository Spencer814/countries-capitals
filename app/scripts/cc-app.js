'use strict';
angular.module('CCApp', ['ngRoute', 'ngAnimate', 'CCLibrary'])

.run(['$rootScope', '$location', function($rootScope, $location) {
	$rootScope.$on('$routeChangeError', function() {
		$location.path("/error");
	});
	$rootScope.$on('$routeChangeStart', function() {
		$rootScope.isLoading = true;
	});
}])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl : '../app/home.html',
		controller: 'homeCtrl'
	})
	.when('/countries', {
		templateUrl : '../app/views/countries.html',
		controller : 'countriesCtrl',
		resolve: {
			countries: ['countries', function(countries) {
				return countries();
			}]
		}
	})
	.when('/countries/:country', {
		templateUrl : '../app/views/capital.html',
		controller : 'capitalCtrl',
		resolve: {
			countryInfo: ['$route', 'country', function($route, country) {
				return country($route.current.params.country);
			}]
		}
	})
	.when('/error', {
		template : '<p>Error Page: Not Found</p>'
	})
	.otherwise({
		redirectTo : '/'
	});
}])

.controller('homeCtrl', ['$rootScope', '$timeout',
function($rootScope, $timeout) {
	$timeout(function() {
		$rootScope.isLoading = false;
	}, 2000);
}])

.controller('countriesCtrl', ['$scope', '$rootScope', '$location', 'countries',
function($scope, $rootScope, $location, countries) {
	$scope.order = 'countryName';
	$scope.reverseSort = false;
	$rootScope.isLoading = false;
	$scope.changeOrder = function(order) {
		$scope.reverseSort = (order === $scope.order) ? !$scope.reverseSort : false;
		$scope.order = order || 'countryName';
	};
	$scope.changeLocation = function(location) {
		$location.path('/countries/'+location);
	};
	$scope.countries = countries.geonames;
}])

.controller('capitalCtrl', ['$scope', '$rootScope', '$route', 'countryInfo', 'neighbors', 'capital',
function($scope, $rootScope, $route, countryInfo, neighbors, capital) {
	$scope.country = countryInfo.geonames[0];
	$scope.isLoadingCount = 0;
	neighbors($route.current.params.country).then(function(data) {
		$scope.neighbors = data.geonames;
		$scope.isLoadingCount++;
		if($scope.isLoadingCount === 2) {
			$rootScope.isLoading = false;
		}
	});
	capital($route.current.params.country).then(function(data) {
		$scope.capital = data.geonames[0];
		$scope.isLoadingCount++;
		if($scope.isLoadingCount === 2) {
			$rootScope.isLoading = false;
		}
	});
}]);
