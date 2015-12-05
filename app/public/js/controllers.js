var usersControllers = angular.module('usersControllers', []);

usersControllers.controller('UsersListCtrl', ['$scope', '$http',
	function ($scope, $http) {
		$http.get("http://localhost:3000/get").success(function (data) {
			$scope.usersObj = data;

		});
  }
]);
