describe('CCApp', function() {
	beforeEach(module('CCApp'));

	describe('/ route', function() {
		it('should load the template and controller',
		inject(function($location, $rootScope, $httpBackend, $route) {
			$httpBackend.whenGET('../app/home.html').respond('...');
			$httpBackend.expectGET('../app/home.html').respond({});

			$rootScope.$apply(function() {
				$location.path('/');
			});
			$httpBackend.flush();
			expect($route.current.controller).toBe('homeCtrl');
			expect($route.current.loadedTemplateUrl).toBe('../app/home.html');

			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		}));
	});
	describe('/countries route', function() {
		it('should load the template, controller, and call the resolve',
		inject(function($location, $rootScope, $httpBackend, $route) {
			$httpBackend.whenGET('../app/views/countries.html').respond('...');
			$httpBackend.expectGET('http://api.geonames.org/countryInfo?type=JSON&username=Spencer814').respond({});

			$rootScope.$apply(function() {
				$location.path('/countries');
			});
			$httpBackend.flush();
			expect($route.current.controller).toBe('countriesCtrl');
			expect($route.current.loadedTemplateUrl).toBe('../app/views/countries.html');

			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		}));
	});
	describe('/countries/:country route', function() {
		it('should load the template, controller, and call the resolve',
		inject(function($location, $rootScope, $httpBackend, $route) {
			$httpBackend.whenGET('../app/views/capital.html').respond('...');
			$httpBackend.expectGET('http://api.geonames.org/countryInfo?country=:country&type=JSON&username=Spencer814').respond({});

			$rootScope.$apply(function() {
				$location.path('/countries/:country');
			});
			$httpBackend.flush();
			expect($route.current.controller).toBe('capitalCtrl');
			expect($route.current.loadedTemplateUrl).toBe('../app/views/capital.html');

			$httpBackend.verifyNoOutstandingRequest();
			$httpBackend.verifyNoOutstandingExpectation();
		}));
	});
	describe('homeCtrl', function() {
		var ctrl, scope, time;
		beforeEach(inject(function($controller, $rootScope, $timeout) {
			scope = $rootScope.$new();
			ctrl = $controller('homeCtrl', {
				$scope: scope
			});
			time = 2000;
		}));
		it('should load the controller', function() {
			time.isLoading = false;
		});
	});
	describe('countriesCtrl', function() {
		var ctrl, scope;
		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller('countriesCtrl', {
				$scope: scope
			});
		}));
		it('should change the country', function() {
			scope.order = 'countryName';
			scope.reverseSort = false;
			scope.changeLocation({
				$location: '/countries/'+location
			});
			scope.countries = '/countries/'+location.geonames;
		});
	});
});

describe('url', function() {
	beforeEach(module('CCLibrary'));

	describe('countries', function() {
		it('should compile the list of countries', function() {
			module(function($provide) {
				$provide.value('url', function(value) {
					return value;
				});
			});
			inject(function(countries) {
				expect(countries()).toBe('countryInfo');
			});
		});
	});
	describe('country', function() {
		it('should query the country information', function() {
			module(function($provide) {
				$provide.value('url', function(value) {
					return value;
				});
			});
			inject(function(country) {
				expect(country()).toBe('countryInfo', {country: name});
			});
		});
	});
	describe('neighbors', function() {
		it('should query the neighbors of the selected country', function() {
			module(function($provide) {
				$provide.value('url', function(value) {
					return value;
				});
			});
			inject(function(neighbors) {
				expect(neighbors()).toBe('neighbours', {country: name});
			});
		});
	});
	describe('capital', function() {
		it('should query the capital of the selected country', function() {
			module(function($provide) {
				$provide.value('url', function(value) {
					return value;
				});
			});
			inject(function(capital) {
				expect(capital()).toBe('search', {country: name});
			});
		});
	});
});