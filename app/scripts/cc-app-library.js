'use strict';
angular.module('CCLibrary', [])
	.constant('GEONAME_API_BASEURL', 'http://api.geonames.org/')
	.constant('GEONAME_USERNAME', 'Spencer814')
	// .constant('GEONAME_JSON', '&type=JSON')

	.factory('url', ['$http', '$q', 'GEONAME_API_BASEURL', 'GEONAME_USERNAME',
		function($http, $q, GEONAME_API_BASEURL, GEONAME_USERNAME){

		return function(path, params){
			var params = params || {};
			params.username = GEONAME_USERNAME;
			params.type = 'JSON';
			var defer = $q.defer();
			$http.get(GEONAME_API_BASEURL + path,
				{
					params: params,
					cache: true
				})
				.success(function(data){
					defer.resolve(data);
				});
				return defer.promise;
			};

	}])
	.factory('urlJSON', ['$http', '$q', 'GEONAME_API_BASEURL', 'GEONAME_USERNAME',
	 function($http, $q, GEONAME_API_BASEURL, GEONAME_USERNAME){

    return function(path, params){
      var paramsJSON = params || {};
			params.username = GEONAME_USERNAME;
			params.coordinates = {};
			var defer = $q.defer();
			$http.get(GEONAME_API_BASEURL + path,
				{
					params: params,
					cache: true
				})
				.success(function(data){
					defer.resolve(data);
				});
				return defer.promise;
    };

	}])

	.factory('countries', ['url',
		function(url){
		return function(){
			return url('countryInfo');
		};

	}])

	.factory('country', ['url',
		function(url){
		return function(name){
			console.log(url('countryInfo', {country: name}));
			return url('countryInfo', {country: name});
		};

	}])

	.factory('neighbors', ['url',
		function(url){
		return function(name){
			console.log(url('neighbours', {country: name}));
			return url('neighbours', {country: name});
		};

	}])

	.factory('timezone', ['urlJSON',
		function(urlJSON){
		return function(lat, lng){
			console.log(urlJSON('timezoneJSON',  {lat: lat, lng: lng}));
			return urlJSON('timezoneJSON',  {lat: lat, lng: lng});
		};

	}])

	.factory('capital', ['url',
		function(url){
		return function(name){
			return url('search', {country: name, featureCode: 'PPLC'});
		};

	}]);
