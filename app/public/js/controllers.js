var usersControllers = angular.module('usersControllers', []);
/*=============================================USERS and GRAPHS CTRL============================================*/

usersControllers.controller('UsersListCtrl', ['$scope', '$http','$routeParams',
	function ($scope, $http, $routeParams) {
		$http.get("http://localhost:3000/get").success(function (data) {
			$scope.usersObj = data;

		});
  }
]);
/*=============================================MAP CTRL============================================*/

usersControllers.controller('MapCtrl', ['$scope','$routeParams', '$http','geolocation',
	function ($scope, $routeParams, $http, geolocation) {

		//gloabal controller vars
		$scope.markers = [];
		var tempMarker = {};
		var mapObjectsStack = [];
		var mapObjectsCoorStack = [];
		var iterator = 0;
		var LeadsInterval;
		var noLeadClicked = true;

		$http.get("http://localhost:3000/get").success(function (data) {
			$scope.mapObjects = data;
			// $scope.camps = [];
			// 			angular.forEach(data, function(object) {
			// 					if($scope.camps.length <= 0) {
			// 						$scope.camps.push({id:object.campName,coor:object.centerCoor});
			// 					}
			// 					else{
			// 						angular.forEach($scope.camps, function(singleCamp){
			// 							if(angular.isDefined(singleCamp.id)){
			// 								if (singleCamp.id.indexOf(object.campName) === -1) {
			// 										$scope.camps.push({id:object.campName,coor:object.centerCoor});
			// 								}
			// 							}
			// 						});
			// 					}
			// 		});
		});

    $scope.mapData = function (){
			$http.get('../json/map.json').then(function(data){
				$scope.mapStyle = data;
				geolocation.getLocation().then(function(result){
					//for curreent location
					// $scope.coords = {latitude:result.coords.latitude, longitude:result.coords.longitude};
					//default Rotchild blvd
					$scope.coords ={latitude:32.0635743,longitude:34.7773985};
					initialize($scope.mapStyle.data, $scope.coords);
					mapObjectsCoor($scope.mapObjects);

				});
			});
		}

		function mapObjectsCoor(data){
					  mapObjectsStack = [];
						mapObjectsCoorStack = [];

						angular.forEach(data, function(usersObj) {
							angular.forEach(usersObj.users, function(singleUser) {
								if(angular.isDefined(singleUser.tentCoor)){
									var objCoor = { latitude: singleUser.tentCoor[0].latitude ,
										 							longitude: singleUser.tentCoor[0].longitude};
									mapObjectsCoorStack.push(objCoor);
									mapObjectsStack.push(singleUser);
								}
							});
						});

						$scope.mapObjectsCoor = mapObjectsCoorStack;
						$scope.mapObjectsStack = mapObjectsStack;

						if($scope.mapObjectsStack != null){
							for (i = 0; i < $scope.mapObjectsCoor.length; i++){
								 createMarker($scope.mapObjectsCoor[i],$scope.mapObjectsStack[i]);
							}

							//intervaling between leads until a lead was clicked by the user
							//--todo-- make the interval stop when user clicked
							if(noLeadClicked){
									clearInterval(LeadsInterval);
									LeadsInterval = setInterval(function(){
													var i =	Math.floor(Math.random() * ($scope.markers.length + 1));
													google.maps.event.trigger( $scope.markers[i], 'click' );
													console.log($scope.markers[i].content);
									},"5000");
							}
						}
		};

		var createMarker = function (info , obj){

								var path = '../../images/black-circle.png';
								$scope.momObj = obj;
								iterator++;

								var markerImage = new google.maps.MarkerImage(
								    '../../images/black-circle.png',
								    new google.maps.Size(12,12), //size
								    null, //origin
								    null, //anchor
								    new google.maps.Size(12,12) //scale
								);

								var marker = new google.maps.Marker({
									map: $scope.map,
									position: new google.maps.LatLng(info.latitude, info.longitude),
									info: info,
									//animation: google.maps.Animation.DROP,
									content: $scope.momObj,
									icon: markerImage,
									id: iterator
								});

								if(angular.isDefined(marker)){
									$scope.markers.push(marker);
								}

								google.maps.event.addListener(marker, 'click', function(){
								$scope.rightNavContent(marker.content);
								noLeadClicked = false;
								//clearInterval(LeadsInterval);
								if(typeof tempMarker["id"] === 'undefined'){
										marker.setIcon("../../images/yellow-circle.png");
									}
									else {
										if (parseInt(tempMarker["id"]) != marker["id"]){
											tempMarker.setIcon("../../images/black-circle.png");
											marker.setIcon("../../images/yellow-circle.png");
										}
									}
									tempMarker = marker;
							});

							//add info window when hover on maker show user name
							var infoWindow = new google.maps.InfoWindow({
								content: marker.content.userFname+" "+marker.content.userLname
							});

							google.maps.event.addListener(marker,'mouseover',function(){
									infoWindow.open($scope.map, marker);
							});

							google.maps.event.addListener(marker,'mouseout',function(){
									infoWindow.close($scope.map, marker);
							});

							 //when the map zoom changes, resize the icon based on the zoom level so the marker covers the same geographic area
							 google.maps.event.addListener($scope.map, 'zoom_changed', function() {
									 var pixelSizeAtZoom0 = 13; //the size of the icon at zoom level 0
									 var maxPixelSize = 13; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels
									 var zoom = $scope.map.getZoom();
									 var relativePixelSize = Math.round(pixelSizeAtZoom0*Math.pow(3,zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in

									 if(relativePixelSize > maxPixelSize) //restrict the maximum size of the icon
											 relativePixelSize = maxPixelSize;
									 //change the size of the icon
									 marker.setIcon(
											 new google.maps.MarkerImage(
													 marker.getIcon().url, //marker's same icon graphic
													 null,//size
													 null,//origin
													 null, //anchor
													 new google.maps.Size(relativePixelSize, relativePixelSize) //changes the scale
											 )
									 );
							 });
		}

		$scope.rightNavContent = function(content){
			$scope.$apply(function(){
				$scope.leadStory = content.whatIDid;
				$scope.userInfo = content.userFname +" "+content.userLname;
				$scope.protestStory = content.conclusion;
			});
		}

    function initialize(_data, center){
      			var mapCanvas = document.getElementById('map-canvas');
      			var mapOptions = {
      				center: new google.maps.LatLng(center.latitude, center.longitude),
      				zoom: 16,
      				mapTypeId: google.maps.MapTypeId.ROADMAP,
      				styles: _data
      			}
      			$scope.map = new google.maps.Map(mapCanvas, mapOptions);
    }

		$scope.toggle = function() {
						if ($('.toggle-button').hasClass('glyphicon-menu-down')){
							$('.toggle-button').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
							$('#graph-nav').animate({bottom:"-23%"});
						}
						else{
							$('.toggle-button').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
							$('#graph-nav').animate({bottom:"0%"});
						}
		};
  }
]);
