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


        momentService.createMoment = function(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_sal,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat,callback)  {
      return $http({
      method: 'POST',
      url: 'http://localhost:3000/map',
      dataType: 'json',
      crossDomain: true,
      data: {
          'leadRank':1,
          'adminApproval':true,
          'userFname':_fn,
          'userLname':_ln,
          'age':_age,
          'rent11':r11,
          'rent16':r16,
          'status11':st11,
          'status16':_st16,
          'city11':_c11,
          'city16':_c16,
          'happy':_happy,
          "protestSucceed": _protestSucceed,
          "government": _gov,
          "socialPressure": _social,
          "renewProtest": _renew,
          "tentImageLink": _tent,
          'userprofileImage':_profile,
          "conclusion":_conc,
          'tentCoor':{'latitude' : 34.777820, 'longitude' : 32.066823}
      },
      headers: {'Content-Type': 'application/json'}
    });
  };
  return momentService;
}]);
