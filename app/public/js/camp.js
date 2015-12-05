var j14App = angular.module("j14App",['ngRoute','usersControllers']);//first of all we make the module
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
        controller: 'UsersListCtrl'
      }).
      when('/map', {
        templateUrl: 'views/partials/map.html',
        controller: 'UsersListCtrl'
      }).
      otherwise({
        redirectTo: '/map'
      });
	}]);
