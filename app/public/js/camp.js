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
        redirectTo: '/map'
      });
	}]);

j14App.factory('momentService',['$http',function($http){
  var momentService = {};
  momentService.createMoment = function(user) {
      return $http({
      method: 'POST',
      url: 'http://localhost:3000/map',
      data: {
          'leadRank':1,
          'adminApproval':true,
          'userFname':user.fn,
          'userLname':user.ln,
          'age':user.age,
          'rent11':user.r11,
          'rent16':user.r16,
          'status11':user.st11,
          'status16':user.st16,
          'city11':user.c11,
          'city16':user.c16,
          'salaryIncreased':user.sal,
          'happy':user.happy,
          "protestSucceed": user.success,
          "government": user.gov,
          "socialPressure": user.pressure,
          "renewProtest": user.renew,
          "tentImageLink": user.tent,
          'userprofileImage':user.profile,
          "conclusion":user.conc,
          'tentCoor':{'latitude' : 34.777820, 'longitude' : 32.066823}
      },
      headers: {'Content-Type': 'application/json'}
    });
  };
  return momentService;
}]);