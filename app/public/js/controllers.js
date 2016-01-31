var usersControllers = angular.module('usersControllers', []);

/*=============================================MAP CTRL============================================*/

usersControllers.controller('MapCtrl', ['$scope','$routeParams', '$http','geolocation','momentService','Upload','cookies',
	function ($scope, $routeParams, $http, geolocation,momentService,Upload,cookies) {

        //global controller vars
        $scope.markers = [];
        $scope.userMaster = {};
        $scope.mapObjects = {};
        var map;
        var newMarkerAdded = false;
        var storyOpen = false;
        var newMarker;
        var randomLead ;
        var tempMarker = {};
        var mapObjectsStack = [];
        var mapObjectsCoorStack = [];
        var iterator = 0;
        var formPage = 0;
        var LeadsInterval;
        var noLeadClicked = true;
        var	userLatitude;
        var	userLongitude;
        var userCamp = "Rotshilds";
        var mapLatitude = 32.0635743;
        var mapLongitude = 34.7773985;

        var server = "http://localhost:3000/";
        var loadedOnce = false;
        var chartAge = false;
        var chartSankey= false;
        var chartLine= false;

        //graphs
		var ageProtestStack = [];  // age vs protest succeed graph
		var googleChartScript ="https://www.gstatic.com/charts/loader.js";
		//ages groups for protestSucceed graph
		var a = [0, 0, 0]; 	// 0-18
		var b = [0, 0, 0]; 	// 18-25
		var c = [0, 0, 0]; 	// 26-30
		var d = [0, 0, 0];	// 31-35
		var e = [0, 0, 0];	// 36-40
		var f = [0, 0, 0]; 	// 41-45
		var g = [0, 0, 0]; 	// 46-50
		var h = [0, 0, 0]; 	// 51-55
		var i = [0, 0, 0]; 	// 56-60
		var j = [0, 0, 0]; 	// 61-65
		var k = [0, 0, 0]; 	// 66-70
		var l = [0, 0, 0]; 	// 70+

		var city11Vs16Stack = []; // city 11 vs city 16
		var rent11Vs16Stack = []; // rent 2011 Vs rent 2016

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
        });


        $scope.mapData = function (){
            $http.get('../json/map.json').then(function(data){
                $scope.mapStyle = data;
                geolocation.getLocation().then(function(result){
                    //for curreent location
                    // $scope.coords = {latitude:result.coords.latitude, longitude:result.coords.longitude};
                    //default Rotchild blvd
                    $scope.coords ={latitude:mapLatitude,longitude:mapLongitude};
                    initialize($scope.mapStyle.data, $scope.coords);
                    setTimeout(function(){
                        mapObjectsCoor($scope.mapObjects);},1000);
                });
            });
        };

		function isDefined(field) {
			return angular.isDefined(field);
		}

        function mapObjectsCoor(data){

            mapObjectsStack = [];
            mapObjectsCoorStack = [];
			ageProtestStack = [];

            angular.forEach(data, function(usersObj) {
                angular.forEach(usersObj.users, function(singleUser) {
                    if(angular.isDefined(singleUser.tentCoor)){
                        var objCoor = { latitude: singleUser.tentCoor[0].latitude,
                            longitude: singleUser.tentCoor[0].longitude};
                        mapObjectsCoorStack.push(objCoor);
                        mapObjectsStack.push(singleUser);
                    }
					//graph age & protest succeed
					if (isDefined(singleUser.age) && isDefined(singleUser.protestSucceed)) {
						var userAge = parseInt(singleUser.age);
						var protestSucceed = singleUser.protestSucceed;
						if (userAge > 0 && userAge < 19) {
							if (protestSucceed) {
								a[1]++;
							}
							else {
								a[2]++;
							}
							a[0]++;
						} else if (userAge > 18 && userAge < 26) {
							if (protestSucceed) {
								b[1]++;
							}
							else {
								b[2]++;
							}
							b[0]++;
						} else if (userAge > 25 && userAge < 31) {
							if (protestSucceed) {
								c[1]++;
							}
							else {
								c[2]++;
							}
							c[0]++;
						} else if (userAge > 30 && userAge < 36) {
							if (protestSucceed) {
								d[1]++;
							}
							else {
								d[2]++;
							}
							d[0]++;
						} else if (userAge > 35 && userAge < 41) {
							if (protestSucceed) {
								e[1]++;
							}
							else {
								e[2]++;
							}
							e[0]++;
						} else if (userAge > 40 && userAge < 46) {
							if (protestSucceed) {
								f[1]++;
							}
							else {
								f[2]++;
							}
							f[0]++;
						} else if (userAge > 45 && userAge < 51) {
							if (protestSucceed) {
								g[1]++;
							}
							else {
								g[2]++;
							}
							g[0]++;
						} else if (userAge > 50 && userAge < 56) {
							if (protestSucceed) {
								h[1]++;
							}
							else {
								h[2]++;
							}
							h[0]++;
						} else if (userAge > 55 && userAge < 61) {
							if (protestSucceed) {
								i[1]++;
							}
							else {
								i[2]++;
							}
							i[0]++;
						} else if (userAge > 60 && userAge < 66) {
							if (protestSucceed) {
								j[1]++;
							}
							else {
								j[2]++;
							}
							j[0]++;
						} else if (userAge > 65 && userAge < 71) {
							if (protestSucceed) {
								k[1]++;
							}
							else {
								k[2]++;
							}
							k[0]++;
						} else if (userAge > 70) {
							if (protestSucceed) {
								l[1]++;
							}
							else {
								l[2]++;
							}
							l[0]++;
						}

						var ageProtest = {age: singleUser.age, protest: singleUser.protestSucceed};
						ageProtestStack.push(ageProtest);
					}

					//graph city 2011 Vs city 2016
					if (isDefined(singleUser.city11) && isDefined(singleUser.city16)) {
                        if (singleUser.city16){
                            var detectCircle = singleUser.city16;
                            singleUser.city16 = detectCircle + " ";
                        }
						var cityStack = {city11: singleUser.city11, city16: singleUser.city16};
						city11Vs16Stack.push(cityStack);
					}
					//graph rent 2011 Vs rent 2016
					if (isDefined(singleUser.rent11 && singleUser.rent11 > 0) && isDefined(singleUser.rent16 && singleUser.rent16 > 0)) {
						var rentStack = {rent11: singleUser.rent11, rent16: singleUser.rent16};
						rent11Vs16Stack.push(rentStack);
					}
                });
            });

            $scope.mapObjectsCoor = mapObjectsCoorStack;
            $scope.mapObjectsStack = mapObjectsStack;

			//graphs
			$scope.ageProtestStack = ageProtestStack;
			$scope.city11Vs16Stack = city11Vs16Stack;
			$scope.rent11Vs16Stack = rent11Vs16Stack;


            if($scope.mapObjectsStack != null){
                for (i = 0; i < $scope.mapObjectsCoor.length; i++){
                    createMarker($scope.mapObjectsCoor[i],$scope.mapObjectsStack[i]);
                }

                //intervaling between leads until a lead was clicked by the user
                if(noLeadClicked){
                    //init the first lead
                    setTimeout(function(){
                        randomLead =	Math.floor(Math.random() * ($scope.markers.length));
                        google.maps.event.trigger( $scope.markers[randomLead], 'mouseover' );
                        setTimeout(function(){
                            removeBubbleScroll();
                        },150);

                    },100);

                    //intervaling between leadsevery 5 seconds
                    LeadsInterval = setInterval(function(){
                        randomLead =	Math.floor(Math.random() * ($scope.markers.length));
                        google.maps.event.trigger( $scope.markers[randomLead], 'mouseover' );
                    },5000);
                }
            }
        }


        // a function to get the script asynchronously
        function getScript(url, success) {
            if(!loadedOnce){
                var script = document.createElement('script');
                script.src = url;
                var head = document.getElementsByTagName('head')[0],
                    done = false;
                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function() {
                    if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                        done = true;
                        success();
                        script.onload = script.onreadystatechange = null;
                        head.removeChild(script);
                    }
                };
                head.appendChild(script);
            }
            return false;
        }

        $scope.loadGraphs = function() {
            if(!loadedOnce){
                $.getScript(
                    googleChartScript,
                    function() {
                        google.charts.load('current', {'packages':['corechart','sankey']});
                        google.charts.setOnLoadCallback(drawVisualization);
                        function drawVisualization() {
                            var data = google.visualization.arrayToDataTable([
                                ['גיל', 'כן','' ,'לא'],
                                ['1-18',a[1],0,a[2]],
                                ['19-25',b[1],0,b[2]],
                                ['26-30',c[1],0,c[2]],
                                ['31-35',d[1],0,d[2]],
                                ['36-40',e[1],0,e[2]],
                                ['41-45',f[1],0,f[2]],
                                ['46-50',g[1],0,g[2]],
                                ['51-55',h[1],0,h[2]],
                                ['56-60',i[1],0,i[2]],
                                ['61-65',j[1],0,j[2]],
                                ['66-70',k[1],0,k[2]],
                                ['70+',l[1],0,l[2]]

                            ]);

                            var options = {
                                vAxis:{
                                    textPosition: 'none',
                                    gridlines:{
                                        color: '#1d2636'
                                    }
                                },
                                bar: {
                                    groupWidth: '8%',
                                    class:"barClass"
                                },
                                legend:'none',
                                seriesType: 'bars',
                                series: {3:{type:'line'}},
                                hAxis:{
                                    textColor:'#f2f2f2'
                                },
                                backgroundColor:'#1d2636',
                                baselineColor:'#f2f2f2',
                                colors: ['#2cd797','#1d2636', '#fc4951']
                            };
                            var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
                            chart.draw(data, options);
                        }

                        sankey();

                    });
                loadedOnce = true;

            }
            else return true;
        };
        //var stackFormat = function(original){
        //
        //    for (i = 0; i < original.length; i++){
        //        city11Vs16Stack[i].city11 == city11Vs16Stack[i].city16;
        //    }
        //};

        var sankey = function(){
            google.charts.setOnLoadCallback(drawCharts);
            function drawCharts() {
                var datas = new google.visualization.DataTable();
                datas.addColumn('string', 'From');
                datas.addColumn('string', 'To');
                datas.addColumn('number', 'Weight');
                datas.addRows([
                    [ 	$scope.city11Vs16Stack[0].city11, 	$scope.city11Vs16Stack[0].city16 , 4],
                    [ 	$scope.city11Vs16Stack[1].city11, 	$scope.city11Vs16Stack[1].city16 , 1],
                    [ 	$scope.city11Vs16Stack[2].city11, 	$scope.city11Vs16Stack[2].city16 , 4 ],
                    [ 	$scope.city11Vs16Stack[7].city11, 	$scope.city11Vs16Stack[7].city16 , 2 ],
                    [ 	$scope.city11Vs16Stack[8].city11, 	$scope.city11Vs16Stack[8].city16 , 3],
                    [ 	$scope.city11Vs16Stack[9].city11, 	$scope.city11Vs16Stack[9].city16 , 4 ],
                    [ 	$scope.city11Vs16Stack[10].city11, 	$scope.city11Vs16Stack[10].city16 , 4 ],
                    [ 	$scope.city11Vs16Stack[11].city11, 	$scope.city11Vs16Stack[11].city16 , 7 ],
                    [ 	$scope.city11Vs16Stack[12].city11, 	$scope.city11Vs16Stack[12].city16 , 1 ],
                    [ 	$scope.city11Vs16Stack[13].city11, 	$scope.city11Vs16Stack[13].city16 , 2 ],
                    [ 	$scope.city11Vs16Stack[14].city11, 	$scope.city11Vs16Stack[14].city16 , 3 ],
                    [ 	$scope.city11Vs16Stack[15].city11, 	$scope.city11Vs16Stack[15].city16 , 3 ],
                    [ 	$scope.city11Vs16Stack[16].city11, 	$scope.city11Vs16Stack[16].city16 , 4 ],
                    [ 	$scope.city11Vs16Stack[17].city11, 	$scope.city11Vs16Stack[17].city16 , 6 ],
                    [ 	$scope.city11Vs16Stack[18].city11, 	$scope.city11Vs16Stack[18].city16 , 7 ],
                    [ 	$scope.city11Vs16Stack[19].city11, 	$scope.city11Vs16Stack[19].city16 , 8 ],
                    [ 	$scope.city11Vs16Stack[20].city11, 	$scope.city11Vs16Stack[20].city16 , 8 ],
                    [ 	$scope.city11Vs16Stack[21].city11, 	$scope.city11Vs16Stack[21].city16 , 1 ],
                    [ 	$scope.city11Vs16Stack[3].city11, 	$scope.city11Vs16Stack[3].city16 , 6 ],
                    [ 	$scope.city11Vs16Stack[4].city11, 	$scope.city11Vs16Stack[4].city16 , 2 ],
                    [ 	$scope.city11Vs16Stack[5].city11, 	$scope.city11Vs16Stack[5].city16 , 6 ],
                    [ 	$scope.city11Vs16Stack[6].city11, 	$scope.city11Vs16Stack[6].city16 , 7 ],

                ]);

                // Sets chart options.
                var colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f',
                    '#cab2d6', '#ffff99', '#1f78b4', '#33a02c'];

                var optionss = {
                    width: 850,
                    sankey: {
                        node: {
                            colors: colors
                        },
                        link: {
                            colorMode: 'gradient',
                            colors: colors
                        }
                    }
                };
                // Instantiates and draws our chart, passing in some options.
                var charts = new google.visualization.Sankey(document.getElementById('sankey_basic'));
                charts.draw(datas, optionss);
            }
        };


        var createMarker = function (info , obj){

            var path = '../../images/tag-on-map.svg';
            $scope.momObj = obj;
            iterator++;

            var markerImage = new google.maps.MarkerImage(
                path,
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
                storyOpen = true;
                $scope.rightNavContentStory(marker);


                var profileImage;
                if(!angular.isDefined(marker.content.userprofileImage)||
                   marker.content.userprofileImage == "profileImg" ||
                   marker.content.userprofileImage == "" ){
                   profileImage = "../../images/pixel.png";
                }
                else{
                    profileImage =marker.content.userprofileImage;
                }

                infoBubble.setContent(
                    "<div class='infoBubbleClicked'>"+
                        "<div class='infoBubblePicClicked'>"+
                            "<img src='"+profileImage+"'/>"+
                        "</div>"+
                    "</div>");

                infoBubble.open($scope.map, marker);
                removeBubbleScroll();
                $("#right-nav-story").css( "display", "block" );
                $("#graph-nav").animate({bottom: '-500px'});
                $("#right-nav-story").animate({right: '0px'});
                noLeadClicked = false;
                clearInterval(LeadsInterval);
                google.maps.event.trigger( $scope.markers[randomLead], 'mouseout' );

            });

            infoBubble = new InfoBubble({
                maxWidth: 2000,
                shadowStyle: 0,
                padding: 0,
                backgroundColor: 'transparent',
                borderRadius: 5,
                arrowSize: 0,
                borderWidth: 1,
                borderColor: 'transparent',
                disableAutoPan: true,
                backgroundClassName: 'bubbleBody'
            });

            google.maps.event.addListener(marker,'mouseover',function(){
               if(!storyOpen){
                removeBubbleScroll();
                    infoBubble.setContent(
                        "<div class='infoBubble gm-style-iw'>"+
                            "<div class='infoBubblePic'>"+
                                "<img src='"+ /*marker.content.userprofileImage*/  "../../images/pixel.png" + "'/>"+
                            "</div>"+
                            "<div class='infoBubbleContent'>"+
                                "<p class='infoBubbleHeader'>"+
                                    marker.content.userFname +" "+
                                    marker.content.userLname +" | "+
                                    marker.content.age +" | "+
                                    marker.content.city16 +
                                "</p>"+
                                "<p class='infoBubbleStory'>"+
                                 calculateStoryLengh(marker.content.conclusion)
                                +"</p>"+
                           "</div>" +
                        "</div>");
                    infoBubble.open($scope.map, marker);
                    removeBubbleScroll();
               }
            });

            google.maps.event.addListener(marker,'mouseout',function(){
                if(noLeadClicked){
                    infoBubble.close($scope.map, marker);
                }
            });

        };

        $scope.openGraph = function(graphNumner){

            //==do the graph switches here==//

        }

        //on click on the map a marker for share or add new will added to the map
        function placeMarker(latLng,map) {
            if(!newMarkerAdded){

                newMarkerAdded = true;

                clearInterval(LeadsInterval);
                google.maps.event.trigger( $scope.markers[randomLead], 'mouseout' );

                $("#right-nav-form").css( "display", "block" );
                $("#right-nav-form").animate({right: '0px'});
                $("#right-nav-lead").animate({top: '-1500px'});
                $("#right-nav-story").animate({right: '-1000px'});
                $("#graph-nav").animate({bottom: '-500px'});

                iterator++;
                var markerImage = new google.maps.MarkerImage(
                    '../../images/tag-on-map.svg',
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

                infoBubble = new InfoBubble({
                    shadowStyle: 0,
                    padding: 0,
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    arrowSize: 0,
                    borderWidth: 1,
                    borderColor: 'transparent',
                    disableAutoPan: true,
                    backgroundClassName: 'bubbleBody'
                });

            if(angular.isDefined(newMarker)){
                $scope.markers.push(newMarker);
            }

            google.maps.event.addListener(newMarker, 'click', function(){
                storyOpen = true;
                rightNavContentStoryCurrent();

                infoBubble.setContent(
                    "<div class='infoBubbleClicked'>"+
                        "<div class='infoBubblePicClicked'>"+
                            "<img src='"+"../../images/pixel.png"+"'/>"+
                        "</div>"+
                    "</div>");

                infoBubble.open($scope.map, newMarker);
                removeBubbleScroll();
                $("#right-nav-story").css( "display", "block" );
                $("#graph-nav").animate({bottom: '-500px'});
                $("#right-nav-story").animate({right: '0px'});
                noLeadClicked = false;
                clearInterval(LeadsInterval);
                google.maps.event.trigger( $scope.markers[randomLead], 'mouseout' );

            });

            google.maps.event.addListener(newMarker,'mouseover',function(){
               //console.log(marker);
               removeBubbleScroll();
               if(!storyOpen){
                    infoBubble.setContent(
                        "<div class='infoBubble'>"+
                            "<div class='infoBubblePic'>"+
                                "<img src='"+ /*marker.content.userprofileImage*/ "../../images/pixel.png" + "'/>"+
                            "</div>"+
                            "<div class='infoBubbleContent'>"+
                                "<p class='infoBubbleHeader'>"+
                                    $scope.user.fn  +" "+
                                    $scope.user.ln  +" | "+
                                    $scope.user.age +" | "+
                                    $scope.user.c16 +
                                "</p>"+
                                "<p class='infoBubbleStory'>"
                                + calculateStoryLengh( $scope.user.conc)
                                +"</p>"+
                           "</div>" +
                        "</div>");
                   infoBubble.open($scope.map, newMarker);
                   removeBubbleScroll();
               }
            });


            google.maps.event.addListener(marker,'mouseout',function(){
                if(noLeadClicked){
                    infoBubble.close($scope.map, marker);
                }
            });

            //map.setCenter(new google.maps.
            //   LatLng(marker.getPosition().lat(), marker.getPosition().lng()+1));

            }
        }

        function calculateStoryLengh(story){
            if(story.length<100){return story;}
            var chopedStory = story.substring(0, 100);
            chopedStory+=" . . .";
            return chopedStory;
        }

        //init the story data to the story right nav
        function rightNavContentStoryCurrent(){

            $scope.$apply(function(){
                if(angular.isDefined(marker)){

                $scope.userName = $scope.user.fn +" "+$scope.user.ln;
                var currentStatus;
                if($scope.user.status16=="devorced"){currentStatus = "גרוש";}
                else if($scope.user.status16=="single"){currentStatus = "רווק";}
                else{currentStatus = "נשוי";}

                $scope.userInfo =   $scope.user.age +" | " +currentStatus+" | "+$scope.user.c16;
                $scope.protestStory =  $scope.user.conc;

                if($scope.user.r11>$scope.user.r16){
                    $("#icon1").attr( "class", "icon rentUp" );
                    $("#icon1Desc").attr( "class", "iconDesc green");
                    $("#icon1Desc").text("משלם פחות על שכר דירה מאז 2011");
                }
                else{
                    $("#icon1").attr( "class", "icon rentDown");
                    $("#icon1Desc").attr( "class", "iconDesc red");
                    $("#icon1Desc").text("משלם יותר על שכר דירה מאז 2011");
                }

                if($scope.user.succes=="yes"){
                    $("#icon2").attr( "class", "icon payUp");
                    $("#icon2Desc").attr( "class", "iconDesc green");
                    $("#icon2Desc").text("מרוויח יותר מאז 2011");
                }
                else{
                    $("#icon2").attr( "class", "icon payDown");
                    $("#icon2Desc").attr( "class", "iconDesc red");
                    $("#icon2Desc").text("מרוויח פחות מאז 2011");
                }

                if($scope.user.renew){
                    $("#icon4").attr( "class", "icon renew");
                    $("#icon4Desc").attr( "class", "iconDesc yellow");
                    $("#icon4Desc").text("חושב שצריך לחדש את המחאה");
                }
                else{
                    $("#icon4").attr( "class", "icon notRenew");
                    $("#icon4Desc").text("לא חושב שצריך לחדש את המחאה");
                }

                if($scope.user.happy){
                    $("#icon3").attr( "class", "icon optimi");
                    $("#icon3Desc").attr( "class", "iconDesc green");
                    $("#icon3Desc").text("אופטימי");
                }
                else{
                    $("#icon3").attr( "class", "icon pasimi");
                    $("#icon3Desc").attr( "class", "iconDesc red");
                    $("#icon3Desc").text("פאסימי");
                }

                    if(typeof tempMarker["id"] === 'undefined'){
                        marker.setIcon("../../images/tag-on-map.svg");
                    }
                    else if (parseInt(tempMarker["id"]) != marker["id"]){
                        tempMarker.setIcon("../../images/tag-on-map.svg");
                        marker.setIcon("../../images/tag-on-map.svg");
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

                $scope.userName = marker.content.userFname +" "+marker.content.userLname;
                var currentStatus;
                if(marker.content.status16=="devorced"){currentStatus = "גרוש";}
                else if(marker.content.status16=="single"){currentStatus = "רווק";}
                else{currentStatus = "נשוי";}

                $scope.userInfo =   marker.content.age +" | " +currentStatus+" | "+marker.content.city16;
                $scope.protestStory =  marker.content.conclusion;

                if(marker.content.rent11>marker.content.rent16){
                    $("#icon1").attr( "class", "icon rentUp" );
                    $("#icon1Desc").attr( "class", "iconDesc green");
                    $("#icon1Desc").text("משלם פחות על שכר דירה מאז 2011");
                }
                else{
                    $("#icon1").attr( "class", "icon rentDown");
                    $("#icon1Desc").attr( "class", "iconDesc red");
                    $("#icon1Desc").text("משלם יותר על שכר דירה מאז 2011");
                }

                if(marker.content.salaryIncreased){
                    $("#icon2").attr( "class", "icon payUp");
                    $("#icon2Desc").attr( "class", "iconDesc green");
                    $("#icon2Desc").text("מרוויח יותר מאז 2011");
                }
                else{
                    $("#icon2").attr( "class", "icon payDown");
                    $("#icon2Desc").attr( "class", "iconDesc red");
                    $("#icon2Desc").text("מרוויח פחות מאז 2011");
                }

                if(marker.content.renewProtest){
                    $("#icon4").attr( "class", "icon renew");
                    $("#icon4Desc").attr( "class", "iconDesc yellow");
                    $("#icon4Desc").text("חושב שצריך לחדש את המחאה");
                }
                else{
                    $("#icon4").attr( "class", "icon notRenew");
                    $("#icon4Desc").text("לא חושב שצריך לחדש את המחאה");
                }

                if(marker.content.happy){
                    $("#icon3").attr( "class", "icon optimi");
                    $("#icon3Desc").attr( "class", "iconDesc green");
                    $("#icon3Desc").text("אופטימי");
                }
                else{
                    $("#icon3").attr( "class", "icon pasimi");
                    $("#icon3Desc").attr( "class", "iconDesc red");
                    $("#icon3Desc").text("פאסימי");
                }

                console.log(marker.content.tentImageLink );

                if(!angular.isDefined(marker.content.tentImageLink)||
                    marker.content.tentImageLink =="link" ||
                    marker.content.tentImageLink ==""){
                    $('#defaultUserImage').css('background-image', 'url(../../images/default.png)');
                }
                else{
                    $('#defaultUserImage').css('background-image', 'url(' + marker.content.tentImageLink + ')');
                }

                if(typeof tempMarker["id"] === 'undefined'){
                    marker.setIcon("../../images/tag-on-map.svg");
                }
                else if (parseInt(tempMarker["id"]) != marker["id"]){
                    tempMarker.setIcon("../../images/tag-on-map.svg");
                    marker.setIcon("../../images/tag-on-map.svg");
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
            $scope.map.addListener('click', function(event) {
                userLatitude = event.latLng.lat();
                userLongitude = event.latLng.lng();
                placeMarker(event.latLng,map);
            });
            setTimeout(function(){$("#map-canvas").css({"zIndex": -5});},1000);

        }

        function removeBubbleScroll(){
            $(".infoBubble").each( function(){
                $(this).parent().css({"overflow":"hidden"});
                $(this).parent().parent().css({"overflow":"hidden"});
                $(this).parent().parent().parent().css({"overflow":"hidden"});
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

        $scope.openGraph = function(graphNumner){

            //==do the graph switches here==//

        }

        //click listener to go the the current lead story
        $(".lead-button").click(function() {
            $scope.rightNavContentStory($scope.markers[randomLead]);
            $("#right-nav-lead").css( "display", "none" );
            $("#right-nav-story").css( "display", "block" );
            $("#right-nav-story").animate({right: '0px'});
            $("#graph-nav").animate({bottom: '-500px'});
            noLeadClicked = false;
            clearInterval(LeadsInterval);
            google.maps.event.trigger( $scope.markers[randomLead], 'mouseout' );
        });

        ////click listener to go the next story
        //$(".story-button").click(function() {
        //    randomLead = Math.floor(Math.random() * ($scope.markers.length));
        //    $scope.rightNavContentStory($scope.markers[randomLead]);
        //});

        //loading from json and adding all the camps the the select option on the top
        //var campsList;
        //$http.get('../json/camps.json').then(function(json){
        //    for(var i=0 ;i<json.data.camps.length;i++){
        //        campsList +="<option value=\""+json.data.camps[i].camp+"\">" ;
        //    }
        //    $("#camps").append(campsList);
        //});


        //loading from json and adding all the camps the the select option on the top
        var citiesList;
        $http.get('../json/cities.json').then(function(json){
            for(var i=0 ;i<json.data.cities.length;i++){
                citiesList +="<option value=\""+json.data.cities[i].name+"\">" ;
            }
            $("#cities16").append(citiesList);
            $("#cities11").append(citiesList);

        });


			$scope.createMoment = function (file,user,callback){
                if (angular.isDefined(user)) {
                    $scope.upload($scope.file,$scope.user);
                }
                else console.log("Oh Oh Something Went Wrong");

            $scope.userMaster = angular.copy(user);
            console.log($scope.userMaster.fn);
            var name = $scope.userMaster.fn;
            window.alert(name+", תודה על השתתפותך נתונך עברו לאישור עורכי האתר");
            closeForm();
        };

        $scope.upload = function (file,user) {
            Upload.upload({
                url: server + 'map',
                data: {file: file, user: user},
                headers: {'Content-Type': undefined},
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
            $("#graph-nav").animate({bottom: '-22%'});
        }

            //$scope.rotatediv = function (){
            //    $('#sankey_basic').css({
            //        '-moz-transform':'rotate(90deg)',
            //        '-webkit-transform':'rotate(90deg)',
            //        '-o-transform':'rotate(90deg)',
            //        '-ms-transform':'rotate(90deg)',
            //        'transform':'rotate(90deg)'
            //    });
            //};

        //on click on the map a marker for share or add new will added to the map
        //--todo-- the form and the buttoms beside the maker--//
        function placeMarker(latLng,map) {
            if(!newMarkerAdded){

                $("#right-nav-form").css( "display", "block" );
                //animated version
                $("#right-nav-form").animate({right: '0px'});
                $("#right-nav-lead").animate({top: '-1500px'});
                $("#right-nav-story").animate({right: '-1000px'});
                $("#graph-nav").animate({bottom: '-500px'});

                iterator++;
                var markerImage = new google.maps.MarkerImage(
                    '../../images/tag-on-map.svg',
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


                var tags1 = '<div class="panel panel-default" ng-controller="MomentsListCtrl" ><div class="panel-heading panelHeadTakeMe panel-font" style =" ';
                var tags11 = '">';
                var tags2 = '</div><div class="panel-body panelBodyTakeMe" style =" ';
                var tags22 = '"><p>';
                var tags3 = '</p><a class=" panelBtntakeMe" role="button" href="#/moments/';
                var tags4 ='"style=" ';
                var tags444 = '">Take me</a></div><div class= "class="panel-footer panelFooterTakeMe panel-font " style=" ';
                var tags44 = '<div class= "bodyPanelCnt " style =" ';
                var tags5= '</div></div>';

                infoBubble = new InfoBubble({
                    shadowStyle: 0,
                    padding: 0,
                    backgroundColor: 'transparent',
                    borderRadius: 5,
                    arrowSize: 0,
                    borderWidth: 1,
                    borderColor: 'transparent',
                    disableAutoPan: true,
                    backgroundClassName: 'bubbleBody'
                });

                google.maps.event.addListener(newMarker,'mouseover',function(){
                    //infoWindow.open($scope.map, newMarker);
                    infoBubble.setContent( tags1   + tags11 + tags2 + tags22 + tags3 +  tags4 + tags444 + tags11 + tags5);
                    infoBubble.open($scope.map, newMarker);

                });

                google.maps.event.addListener(newMarker,'mouseout',function(){
                    infoWindow.close($scope.map, newMarker);
                });


                google.maps.event.addListener(infoWindow, 'domready', function() {
                    var l = $('.user-marker-window').parent().parent().parent().siblings();
                    for (var i = 0; i < l.length; i++) {
                        if($(l[i]).css('z-index') == 'auto') {
                            $(l[i]).css('border-radius', '16px 16px 16px 16px');
                            $(l[i]).css('border', '2px solid red');
                        }
                    }
                });
                //map.setCenter(new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()+1));
                newMarkerAdded = true;
            }
        }

        function nextPage(){

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
                $("#form-fourth-page").css( "display", "none" );
                $("#form-fifth-page").css( "display", "block" );
            }
            else if(formPage==5){
                $("#form-next-botton").css( "display", "none" );
                $("#form-send-botton").css( "display", "block" );
                $("#form-fifth-page").css( "display", "none" );
                $("#form-sixed-page").css( "display", "block" );
            }
            $("#form-pagin-"+(formPage)).attr( "class", "form-pagin-close");
            $("#form-pagin-"+(formPage+1)).attr( "class", "form-pagin-open");
        }


        function validatePagefleids(){
            console.log("formPage: " + formPage);
            if(formPage==0){

                var name = $("#userName").val();
                var lastName = $("#userLastName").val();
                var age = $("#userAge").val();
                if(name=="" || lastName==""){
                    $(".err").html("שם או שם המשפחה אינו תקין");
                    return false;
                }
                if( age=="" || age<1 || age> 99 || !$.isNumeric(age)){
                    $(".err").html("הגיל שהוזן אינו תקין");
                    return false;
                }
                $(".err").html("");
                return true;

            }
            else if(formPage==1){

                var didRent11= $scope.user.didRent11;
                var rent11= $scope.user.r11;
                var status11 = $scope.user.st11;
                var cities11 = $scope.user.c11;

                if(didRent11=="" || status11=="" || cities11==""){

                    if(didRent11=="yes"){
                        if(typeof rent11 === 'undefined' || rent11 == '' || rent11<1 || rent11>20000 ){
                            $(".err").html("שכר הדיר שהוזן אינו תקין");
                            return false;
                        }
                    }
                    else{
                        $(".err").html("המידע שהוזן אינו תקין");
                        return false;
                    }
                }
                $(".err").html("");
                return true;

            }
            else if(formPage==2){

                var didRent16= $scope.user.didRent16;
                var rent16= $scope.user.r16;
                var status16 = $scope.user.st16;
                var cities16 = $scope.user.c16;

                console.log("didRent16: "+didRent16);
                console.log("status16: "+status16);
                console.log("cities16: "+cities16);
                console.log("rent16: "+rent16);

                if(didRent16=="" ||status16==""|| cities16==""){

                    if(didRent16=="yes"){
                        if(typeof rent16 === 'undefined' || rent16 == '' || rent16<1 || rent16>20000 ){
                            $(".err").html("שכר הדיר שהוזן אינו תקין");
                            return false;
                        }
                    }
                    else{
                        $(".err").html("המידע שהוזן אינו תקין");
                        return false;
                    }
                }
                else{
                    $(".err").html("");
                    return true;
                }

            }
            else if(formPage==3){

                var q1= $scope.user.pressure;
                var q2= $scope.user.gov;
                var q3= $scope.user.success;
                var q4= $scope.user.happy;
                var q5= $scope.user.renew;

                if(q1=="" ||q2==""|| q3==""|| q4==""|| q5==""){
                    $(".err").html("המידע שהוזן אינו תקין");
                    return false;
                }
                $(".err").html("");
                return true;

            }
            else if(formPage==4){
                var conc= $scope.user.conc;

                if(conc==""){
                    $(".err").html("המידע שהוזן אינו תקין");
                    return false;
                }
                $(".err").html("");
                return true;
            }
            else if(formPage==5){

                $(".err").html("");
                return true;
            }
        }

        $scope.changeGraph = function(graphNum){
            $('#'+ graphNum).css("z-index", 110);
                if(!$('.' + graphNum).hasClass("active")) {
                    $('.' + graphNum).addClass("active");
                    $('#' + graphNum).addClass("active");
                }
            if(graphNum == "d"){
                if($('.e').hasClass("active")) {
                    $('.e').removeClass("active");
                    $('#e').removeClass("active");

                }
                if($('.f').hasClass("active")) {
                    $('.f').removeClass("active");
                    $('#f').removeClass("active");

                }
                $('#e').css("z-index", -10);
                $('#f').css("z-index", -10);
            }
            else if(graphNum == "e"){
                if($('.d').hasClass("active")) {
                    $('.d').removeClass("active");
                    $('#d').removeClass("active");

                }
                if($('.f').hasClass("active")) {
                    $('.f').removeClass("active");
                    $('#f').removeClass("active");

                }
                $('#d').css("z-index", -10);
                $('#f').css("z-index", -10);
            }
            else{
                if($('.e').hasClass("active")) {
                    $('.e').removeClass("active");
                    $('#e').removeClass("active");

                }
                if($('.d').hasClass("active")) {
                    $('.d').removeClass("active");
                    $('#d').removeClass("active");
                }
                $('#e').css("z-index", -10);
                $('#d').css("z-index", -10);
            }
        };

        //form next bottom function --TODO-- add validation to the fields
        $("#form-next-botton").click(function(){
            if(validatePagefleids()){
                nextPage();
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
                $("#form-fourth-page").css( "display", "block" );
                $("#form-fifth-page").css( "display", "none" );
            }
            else if(formPage==4){
                $("#form-next-botton").css( "display", "block" );
                $("#form-send-botton").css( "display", "none" );
                $("#form-fifth-page").css( "display", "block" );
                $("#form-sixed-page").css( "display", "none" );
            }
            $("#form-pagin-"+(formPage+1)).attr( "class", "form-pagin-open");
            $("#form-pagin-"+(formPage+2)).attr( "class", "form-pagin-close");
        });

        //form close votton function, it the user clicked on it the marker temp marker will be removed
        $("#close-form").click(function(){
            $("#right-nav-form").animate({right: '-1000px'});
            $("#right-nav-lead").animate({top: '0px'});
            //$("#right-nav-story").animate({top: '0px'});
            $("#graph-nav").animate({bottom: '-22%'});
            newMarker.setMap(null);
            newMarkerAdded = false;
        });

        //form close votton function, it the user clicked on it the marker temp marker will be removed
        $("#close-story").click(function(){
            storyOpen = false;
            $("#right-nav-story").animate({right: '-1000px'});
            $("#graph-nav").animate({bottom: '-22%'});
        });

        $scope.openRent = function(year,answer){
            if(answer=="yes"){
                $(".rent"+year).css( "display", "block" );
            }
            else{
                $(".rent"+year).css( "display", "none" );
            }
        };

        $scope.shareToFB = function(){
            $('.share').snsShare('שתף אותי', 'http://j14app.herokuapp.com/');
        }


    }]);