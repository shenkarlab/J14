var j14App = angular.module("j14App",['ngRoute','usersControllers','MassAutoComplete','geolocation','nvd3','ngFileUpload','ngCookie']);//first of all we make the module
console.log("camp.js");

j14App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/welcome', {
        templateUrl: 'views/partials/welcome-page.html',
        controller: 'MapCtrl'
      }).
      when('/map', {
        templateUrl: 'views/partials/map.html',
        controller: 'MapCtrl'
      }).
      when('/list', {
        templateUrl: 'views/partials/list.html',
        controller: 'MapCtrl'
      }).
      otherwise({
        redirectTo: '/map'
      });
	}]);

j14App.factory('momentService',['$http',function($http){
  var momentService = {};
        momentService.createMoment = function(_fn, _ln, _age, _st11,_st16 ,_c11,_c16,_r11,_r16,_happy,_protestSucceed,_gov,_social,_renew,_conc,_lan,_lat,callback)  {

            return $http({
      method: 'POST',
      url: 'http://localhost:3000/map',
      dataType: 'json',
      crossDomain: true,
      data: {
          'userFname':_fn,
          'userLname':_ln,
          'age':_age,
          'status11':_st11,
          'status16':_st16,
          'city11':_c11,
          'city16':_c16,
          'rent11':_r11,
          'rent16':_r16,
          'happy':_happy,
          "protestSucceed": _protestSucceed,
          "government": _gov,
          "socialPressure": _social,
          "renewProtest": _renew,
          "tentImageLink": " tent image link",
          'userprofileImage':" user image link",
          "conclusion":_conc,
          'tentCoor':{'latitude' : 34.777820, 'longitude' : 32.066823},
          'leadRank':1,
          'adminApproval':true
      },
      headers: {'Content-Type': 'application/json'}
    });
  };
  return momentService;
}]);


//
//
//j14App.factory('cookieService','$http','cookies',[function($http){
//  var cookieService = {};
//    cookieService.LoggedInUser = {};
//
//    cookieService.savedLoginUser = function(user){
//        cookieService.LoggedInUser = user;
//  };
//    return cookieService;
//}]);