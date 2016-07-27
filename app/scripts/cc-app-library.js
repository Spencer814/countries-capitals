'use strict';
angular.module('CCLibrary', ['CCApp'])

.constant('GEONAME_API_BASEURL', 'http://api.geonames.org/')
.constant('GEONAME_USERNAME', 'Spencer814')

.factory('url', ['$http', '$q', 'GEONAME_API_BASEURL', 'GEONAME_USERNAME',
function($http, $q, GEONAME_API_BASEURL, GEONAME_USERNAME) {
	return function(path, params) {
		params = params || {};
		params.username = GEONAME_USERNAME;
		params.type = 'JSON';
		var defer = $q.defer();
		$http.get(GEONAME_API_BASEURL + path, {
			params: params,
			cache: true
		})
		.success(function(data) {
			defer.resolve(data);
		});
		return defer.promise;
	};
}])

.factory('countries', ['url',
function(url) {
	return function() {
		return url('countryInfo');
	};
}])

.factory('country', ['url',
function(url) {
	return function(name) {
		return url('countryInfo', {country: name});
	};
}])

.factory('neighbors', ['url',
function(url) {
	return function(name) {
		return url('neighbours', {country: name});
	};
}])

.factory('capital', ['url',
function(url) {
	return function(name) {
		return url('search', {country: name});
	};
}]);
