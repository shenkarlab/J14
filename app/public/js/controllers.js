var usersControllers = angular.module('usersControllers', []);
/*=============================================USERS CTRL============================================*/

usersControllers.controller('UsersListCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$http.get("http://localhost:3000/get").success(function (data) {
			$scope.usersObj = data;
			debugger;

		});
  }
]);

/*=============================================MAP CTRL============================================*/

usersControllers.controller('MapCtrl', ['$scope','$routeParams' , '$http','geolocation',
	function ($scope,$routeParams, $http,geolocation) {
		$http.get("http://localhost:3000/get").success(function (data) {
			$scope.mapObjects = data;

		});

    $scope.mapData = function (){
			$http.get('../json/map.json').then(function(data){
				$scope.mapStyle = data;
				geolocation.getLocation().then(function(result){
					$scope.coords = {latitude:result.coords.latitude, longitude:result.coords.longitude};
					initialize($scope.mapStyle.data, $scope.coords);

          function initialize(_data, center){
      			var mapCanvas = document.getElementById('map-canvas');
      			var mapOptions = {
      				center: new google.maps.LatLng(center.latitude, center.longitude),
      				zoom: 14,
      				mapTypeId: google.maps.MapTypeId.ROADMAP,
      				styles: _data
      			}
      			$scope.map = new google.maps.Map(mapCanvas, mapOptions);
      		}



				});

			});
		}


  }
]);
