var j14App = angular.module("j14App",['ngRoute','usersControllers','geolocation']);//first of all we make the module
console.log("camp.js");

j14App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
        when('/welcome', {
        templateUrl: 'views/partials/welcome-page.html',
        controller: 'UsersListCtrl'
      }).
      when('/map/:userId', {
        templateUrl: 'views/partials/single.html',
        controller: 'MapCtrl'
      }).
      when('/map', {
        templateUrl: 'views/partials/map.html',
        controller: 'MapCtrl'
      }).
      when('/list', {
        templateUrl: 'views/partials/list.html',
        controller: 'UsersListCtrl'
      }).
      otherwise({
        redirectTo: '/list'
      });
	}]);
