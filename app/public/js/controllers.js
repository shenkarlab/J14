var usersControllers = angular.module('usersControllers', []);
/*================================USERS and GRAPHS CTRL============================================*/

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
		var map;
		var randomLead ;
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
							if(noLeadClicked){
									//init the first lead
									setTimeout(function(){
										randomLead =	Math.floor(Math.random() * ($scope.markers.length));
										$scope.rightNavContentLead($scope.markers[randomLead]);
									},"500");

									//intervaling between leadsevery 5 seconds
									LeadsInterval = setInterval(function(){
													randomLead =	Math.floor(Math.random() * ($scope.markers.length));
													console.log($scope.markers[randomLead]);
													$scope.rightNavContentLead($scope.markers[randomLead]);
									},"5000");
							}
						}
		};

		var createMarker = function (info , obj){

								var path = '../../images/circle.svg';
								$scope.momObj = obj;
								iterator++;

								var markerImage = new google.maps.MarkerImage(
								    '../../images/circle.svg',
								    new google.maps.Size(13,13), //size
								    null, //origin
								    null, //anchor
								    new google.maps.Size(13,13) //scale
								);

								var marker = new google.maps.Marker({
										map: $scope.map,
										position: new google.maps.LatLng(info.latitude, info.longitude),
										info: info,
										//animation: google.maps.Animation.DROP, //could be cool option
										content: $scope.momObj,
										icon: markerImage,
										id: iterator
								});

								if(angular.isDefined(marker)){
										$scope.markers.push(marker);
								}

								google.maps.event.addListener(marker, 'click', function(){
										$scope.rightNavContentStory(marker);
										$("#right-nav-lead").css( "display", "none" );
										$("#right-nav-story").css( "display", "block" );
										noLeadClicked = false;
										clearInterval(LeadsInterval);
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

							//====================No need because we restrained the zoom====================//
							//  //when the map zoom changes, resize the icon based on the zoom level so the marker covers the same geographic area
							//  google.maps.event.addListener($scope.map, 'zoom_changed', function() {
							// 		 var pixelSizeAtZoom0 = 13; //the size of the icon at zoom level 0
							// 		 var maxPixelSize = 13; //restricts the maximum size of the icon, otherwise the browser will choke at higher zoom levels trying to scale an image to millions of pixels
							// 		 var zoom = $scope.map.getZoom();
							// 		 var relativePixelSize = Math.round(pixelSizeAtZoom0*Math.pow(3,zoom)); // use 2 to the power of current zoom to calculate relative pixel size.  Base of exponent is 2 because relative size should double every time you zoom in
							 //
							// 		 if(relativePixelSize > maxPixelSize) //restrict the maximum size of the icon
							// 				 relativePixelSize = maxPixelSize;
							// 		 //change the size of the icon
							// 		 marker.setIcon(
							// 				 new google.maps.MarkerImage(
							// 						 marker.getIcon().url, //marker's same icon graphic
							// 						 null,//size
							// 						 null,//origin
							// 						 null, //anchor
							// 						 new google.maps.Size(relativePixelSize, relativePixelSize) //changes the scale
							// 				 )
							// 		 );
							//  });
		}

		//init the lead data to the lead right nav
		$scope.rightNavContentLead = function(marker){

				$scope.$apply(function(){

						$scope.leadStory = "\" " + marker.content.whatIDid + " \"";
						$scope.userInfo =  marker.content.userFname +" "+
															 marker.content.userLname +" "+
															 marker.content.age;

						if(typeof tempMarker["id"] === 'undefined'){
								marker.setIcon("../../images/circleSelected.svg");
						}
						else if (parseInt(tempMarker["id"]) != marker["id"]){
								tempMarker.setIcon("../../images/circle.svg");
								marker.setIcon("../../images/circleSelected.svg");
						}
						tempMarker = marker;
				});
		}

		//init the story data to the story right nav
		$scope.rightNavContentStory = function(marker){

			$scope.$apply(function(){

					$scope.leadStory = "\" " + marker.content.whatIDid + " \"";
					$scope.userInfo  = marker.content.userFname +" "+
														 marker.content.userLname +" "+
														 marker.content.age;

					$scope.protestStory =  marker.content.conclusion;

					if(marker.content.rent11>marker.content.rent16){
						$("#icon1").attr( "class", "icon rentDown" );
					}else{
						$("#icon1").attr( "class", "icon rentUp");
					}

					if(marker.content.salaryIncreased){
						$("#icon2").attr( "class", "icon payUp");
					}else{
						$("#icon2").attr( "class", "icon payDown");
					}

					if(marker.content.renewProtest){
						$("#icon3").attr( "class", "icon renew");
					}else{
						$("#icon3").attr( "class", "icon notRenew");
					}

					if(marker.content.happy){
						$("#icon4").attr( "class", "icon optimi");
					}else{
						$("#icon4").attr( "class", "icon pasimi");
					}

					if(typeof tempMarker["id"] === 'undefined'){
							marker.setIcon("../../images/circleSelected.svg");
					}
					else if (parseInt(tempMarker["id"]) != marker["id"]){
							tempMarker.setIcon("../../images/circle.svg");
							marker.setIcon("../../images/circleSelected.svg");
					}
					tempMarker = marker;
			});
		}
		//init the map
    function initialize(_data, center){
	      var mapCanvas = document.getElementById('map-canvas');
	      var mapOptions = {
	      		center: new google.maps.LatLng(center.latitude, center.longitude),
	      		zoom: 16,
						minZoom:16,
	      		mapTypeId: google.maps.MapTypeId.ROADMAP,
	      		styles: _data
	      }
	      $scope.map = new google.maps.Map(mapCanvas, mapOptions);

				//click listener for adding new story
				map = $scope.map;
				$scope.map.addListener('click', function(e) {
						placeMarker(e.latLng, map);
				});
    }

		//on click on the map a marker for share or add new will added to the map
		//--todo-- the form and the buttoms beside the maker--//
		function placeMarker(latLng, map) {
			var markerImage = new google.maps.MarkerImage(
					'../../images/circle.svg',
					new google.maps.Size(13,13), //size
					null, //origin
					null, //anchor
					new google.maps.Size(13,13) //scale
			);
			var marker = new google.maps.Marker({
					position: latLng,
					animation: google.maps.Animation.DROP, //could be cool option
					icon: markerImage,
					id: iterator,
					map:map
			});
		}

		//toggle the bottom nav div
		$scope.toggle = function() {
				if ($('.toggle-button').hasClass('glyphicon-menu-down')){
						$('.toggle-button').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
						$('#graph-nav').animate({bottom:"-22%"});
				}else{
						$('.toggle-button').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
						$('#graph-nav').animate({bottom:"0%"});
				}
		};

		//click listener to go the the current lead story
		$(".lead-button").click(function() {
				$scope.rightNavContentStory($scope.markers[randomLead]);
				$("#right-nav-lead").css( "display", "none" );
				$("#right-nav-story").css( "display", "block" );
				noLeadClicked = false;
				clearInterval(LeadsInterval);
		});

		//click listener to go the next story
		$(".story-button").click(function() {
				randomLead =	Math.floor(Math.random() * ($scope.markers.length));
				console.log(randomLead);
				$scope.rightNavContentStory($scope.markers[randomLead]);
		});

		//hover listeners to the icons descriptions
		$("#icon1").mouseout(function() {
				$("#icon1Desc").text( "" );
		}).mouseover(function() {
				if($("#icon1").hasClass("rentUp")){
					  $("#icon1Desc").attr( "class", "iconDesc green");
						$("#icon1Desc").text("שכר הדירה עלה");
				}else{
					  $("#icon1Desc").attr( "class", "iconDesc red");
						$("#icon1Desc").text("שכר הדירה ירד");
				}
		});

		//hover listeners to the icons descriptions
		$("#icon2").mouseout(function() {
				$("#icon2Desc").text( "" );
		}).mouseover(function() {
				if($("#icon2").hasClass("payUp")){
					  $("#icon2Desc").attr( "class", "iconDesc green");
						$("#icon2Desc").text("שכר עלה");
				}else{
					  $("#icon2Desc").attr( "class", "iconDesc red");
						$("#icon2Desc").text("שכר ירד");
				}
		});

		//hover listeners to the icons descriptions
		$("#icon3").mouseout(function() {
				$("#icon3Desc").text( "" );
		}).mouseover(function() {
				if($("#icon3").hasClass("renew")){
					  $("#icon3Desc").attr( "class", "iconDesc yellow");
						$("#icon3Desc").text("בעד חידוש המחאה");
				}else{
						$("#icon3Desc").text("נגד חידוש המחאה");
				}
		});

		//hover listeners to the icons descriptions
		$("#icon4").mouseout(function() {
				$("#icon4Desc").text( "" );
		}).mouseover(function() {
				if($("#icon4").hasClass("optimi")){
					  $("#icon4Desc").attr( "class", "iconDesc green");
						$("#icon4Desc").text("אופטימי");
				}else{
						$("#icon4Desc").text("פסימי");
						$("#icon4Desc").attr( "class", "iconDesc red");
				}
		});

		//loading from json and adding all the camps the the select option on the top
		var campsList;
		$http.get('../json/camps.json').then(function(json){
				for(var i=0 ;i<json.data.camps.length;i++){
						campsList +="<option value=\""+json.data.camps[i].camp+"\">" ;
				}
				$("#camps").append(campsList);
		});

		//draw chart example from our CDN
		drawChart();

  }
]);
