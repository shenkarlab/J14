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

usersControllers.controller('MapCtrl', ['$scope','$routeParams', '$http','geolocation','momentService','Upload',
	function ($scope, $routeParams, $http, geolocation,momentService,Upload) {

		//gloabal controller vars
		$scope.markers = [];
		$scope.userMaster = {};
		var map;
		var newMarkerAdded = false;
		var newMarker;
		var randomLead ;
		var tempMarker = {};
		var mapObjectsStack = [];
		var mapObjectsCoorStack = [];
		var iterator = 0;
		var formPage = 0;
		var LeadsInterval;
		var noLeadClicked = true;

        var server = "http://localhost:3000/";

		$("#inputFile").change(function () {
				console.log("uploaded");
		        readURL(this);
		});

		function readURL(input) {
		        if (input.files && input.files[0]) {
		            var reader = new FileReader();
		            reader.onload = function (e) {
		            	$('#image_upload_preview').css('backgroundImage','url('+e.target.result+')');
                    };

	                reader.readAsDataURL(input.files[0]);
		        }
		}


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
		};

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
													//console.log($scope.markers[randomLead]);
													$scope.rightNavContentLead($scope.markers[randomLead]);
									},"5000");
							}
						}
		}

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

		};

		//init the lead data to the lead right nav
		$scope.rightNavContentLead = function(marker){

				$scope.$apply(function(){
					if(angular.isDefined(marker)){

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
					}
					else{
						console.log(" Content is not defined");
					}
				});
		};

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
		};
		//init the map
    function initialize(_data, center){
	      var mapCanvas = document.getElementById('map-canvas');
	      var mapOptions = {
	      		center: new google.maps.LatLng(center.latitude, center.longitude),
	      		zoom: 16,
						minZoom:16,
	      		mapTypeId: google.maps.MapTypeId.ROADMAP,
	      		styles: _data
	      };
	      $scope.map = new google.maps.Map(mapCanvas, mapOptions);

				//click listener for adding new story
				map = $scope.map;
				$scope.map.addListener('click', function(e) {
						placeMarker(e.latLng,map);
				});
    }


		//on click on the map a marker for share or add new will added to the map
		////--todo-- the form and the buttoms beside the maker--//
		//function placeMarker(latLng, map) {
		//	var markerImage = new google.maps.MarkerImage(
		//			'../../images/circle.svg',
		//			new google.maps.Size(13,13), //size
		//			null, //origin
		//			null, //anchor
		//			new google.maps.Size(13,13) //scale
		//	);
		//	var marker = new google.maps.Marker({
		//			position: latLng,
		//			animation: google.maps.Animation.DROP, //could be cool option
		//			icon: markerImage,
		//			id: iterator,
		//			map:map
		//	});
		//}

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
				randomLead = Math.floor(Math.random() * ($scope.markers.length));
				//console.log(randomLead);
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
		//drawChart();


		//will be called after the user finished filling the form and pack it into json
		//--TODO -- upload data to mongo
			$scope.createMoment = function (file,user,callback){
                debugger;

                if (angular.isDefined(user) && angular.isDefined(file)) {
                    $scope.upload($scope.file,user);
                }
                //momentService.createMoment(user.fn,user.ln,user.age,user.st11,user.st16,user.c11,user.c16,user.r11,user.r16,user.happy,user.success,user.gov,user.pressure,user.renew,user.conc,"lan","lat",function(moment){


                //});

                $scope.userMaster = angular.copy(user);
				console.log($scope.userMaster.fn);
				var name = $scope.userMaster.fn;
				window.alert(name+", תודה על השתתפותך נתונך עברו לאישור עורכי האתר");
				closeForm();
			};

        $scope.upload = function (file,user) {
            Upload.upload({
                url: server + 'map',
                data: {file: file, 'user': user},
                method: 'POST'
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };


	    //after filling the form correctly close the form and return to the regular view
	    function closeForm(){
				$("#right-nav-form").animate({right: '-1000px'});
				$("#right-nav-lead").animate({top: '0px'});
				$("#right-nav-story").animate({top: '0px'});
				$("#graph-nav").animate({bottom: '-22%'});
  }

		//on click on the map a marker for share or add new will added to the map
		//--todo-- the form and the buttoms beside the maker--//
		function placeMarker(latLng,map) {
			if(!newMarkerAdded){

				$("#right-nav-form").css( "display", "block" );

				//animated version
				$("#right-nav-form").animate({right: '0px'});
				$("#right-nav-lead").animate({top: '-1500px'});
				$("#right-nav-story").animate({top: '-1500px'});
				$("#graph-nav").animate({bottom: '-500px'});

				iterator++;
				var markerImage = new google.maps.MarkerImage(
						'../../images/pendingCircle.svg',
						new google.maps.Size(13,13), //size
						null, //origin
						null, //anchor
						new google.maps.Size(13,13) //scale
				);
				newMarker = new google.maps.Marker({
						position: latLng,
						animation: google.maps.Animation.DROP, //could be cool option
						icon: markerImage,
						id: iterator,
						map:map
				});

				//add info window when hover on maker show pending status
				var infoWindow = new google.maps.InfoWindow({
					content: "תוכן ממתין לאישור"
				});

				//map.setCenter(new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()+1));
				newMarkerAdded = true;
			}
		}

	    //form next bottom function --TODO-- add validation to the fields
		$("#form-next-botton").click(function(){
			formPage++;
			$("#form-prev-botton").css( "display", "block" );
			if(formPage==1){
				$("#form-first-page").css( "display", "none" );
				$("#form-second-page").css( "display", "block" );
			}
			else if(formPage==2){
				$("#form-second-page").css( "display", "none" );
				$("#form-third-page").css( "display", "block" );
			}
			else if(formPage==3){
				$("#form-third-page").css( "display", "none" );
				$("#form-fourth-page").css( "display", "block" );
			}
			else if(formPage==4){
				$("#form-next-botton").css( "display", "none" );
				$("#form-send-botton").css( "display", "block" );
				$("#form-fourth-page").css( "display", "none" );
				$("#form-fifth-page").css( "display", "block" );
			}
		});

		//form prev bottom function
		$("#form-prev-botton").click(function(){
			formPage--;
			if(formPage==0){
				$("#form-first-page").css( "display", "block" );
				$("#form-second-page").css( "display", "none" );
				$("#form-prev-botton").css( "display", "none" );
			}
			else if(formPage==1){
				$("#form-second-page").css( "display", "block" );
				$("#form-third-page").css( "display", "none" );
			}
			else if(formPage==2){
				$("#form-third-page").css( "display", "block" );
				$("#form-fourth-page").css( "display", "none" );
			}
			else if(formPage==3){
				$("#form-next-botton").css( "display", "block" );
				$("#form-send-botton").css( "display", "none" );
				$("#form-fourth-page").css( "display", "block" );
				$("#form-fifth-page").css( "display", "none" );
			}
		});

		//form close votton function, it the user clicked on it the marker temp marker will be removed
		$("#close-form").click(function(){

				//animated version
				$("#right-nav-form").animate({right: '-1000px'});
				$("#right-nav-lead").animate({top: '0px'});
				$("#right-nav-story").animate({top: '0px'});
				$("#graph-nav").animate({bottom: '-22%'});

				//const version
				// $("#right-nav-form").css( "display", "none" );
				// $("#right-nav-lead").css( "display", "block" );
				// $("#right-nav-story").css( "display", "block" );
				// $("#graph-nav").css( "display", "block" );

				newMarker.setMap(null);
				newMarkerAdded = false;
		})

  }
]);
