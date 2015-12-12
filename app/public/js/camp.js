var j14App = angular.module("j14App",['ngRoute','usersControllers','MassAutoComplete','geolocation','nvd3']);//first of all we make the module
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
      when('/graph', {
        templateUrl: 'views/partials/graph.html',
        controller: 'UsersListCtrl'
      }).
      when('/admin-data-validation', {
        templateUrl: 'views/partials/admin-data-validation.html',
        controller: 'UsersListCtrl'
      }).
      otherwise({
        redirectTo: '/list'
      });
	}]);

//Cookie or IdentityService - we need to decide
  j14App.factory('IdentityService', function(){
    var IdentityService = {};
    IdentityService.LoggedInUser = {};

    IdentityService.savedLoginUser = function(user){
      IdentityService.LoggedInUser = user;
    }

      return IdentityService;
  });
