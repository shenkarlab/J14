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

        //global controller vars
        $scope.markers = [];
        $scope.userMaster = {};
        var map;
        var newMarkerAdded = false;
        var storyOpen = false;
        var newMarker;
        var randomLead;
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
                    setTimeout(function(){mapObjectsCoor($scope.mapObjects);},1000);
                });
            });
        };

        function mapObjectsCoor(data){
            mapObjectsStack = [];
            mapObjectsCoorStack = [];

            angular.forEach(data, function(usersObj) {
                angular.forEach(usersObj.users, function(singleUser) {
                    if(angular.isDefined(singleUser.tentCoor)){
                        var objCoor = {
                            latitude: singleUser.tentCoor[0].latitude,
                            longitude: singleUser.tentCoor[0].longitude
                        };
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
                    //init the first lead and clean google viewbubbles default
                    //unwanted views
                    setTimeout(function(){
                        randomLead = Math.floor(Math.random() * ($scope.markers.length));
                        google.maps.event.trigger( $scope.markers[randomLead], 'mouseover' );
                        setTimeout(function(){
                            removeBubbleScroll();
                        },150);

                    },100);

                    //intervaling between leadsevery 5 seconds
                    LeadsInterval = setInterval(function(){
                        randomLead = Math.floor(Math.random() * ($scope.markers.length));
                        google.maps.event.trigger( $scope.markers[randomLead], 'mouseover' );
                    },5000);
                }
            }
        }

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
                //console.log(event.latLng.lat()+" "+event.latLng.lng());
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
            if ($('.toggle-button').hasClass('glyphicon-menu-down'))
            {
                $('.toggle-button').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
                $('#graph-nav').animate({bottom:"-22%"});
            }
            else{
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
            if (angular.isDefined(user) && angular.isDefined(file)) {
                $scope.upload($scope.file,$scope.user);
            }
            $scope.userMaster = angular.copy(user);
            console.log($scope.userMaster.fn);
            var name = $scope.userMaster.fn;

            window.alert(name+", תודה על השתתפותך נתונך עברו לאישור עורכי האתר");
            closeForm();
        };

        $scope.upload = function (file,user)
        {
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
            console.log("formPage: "+formPage);
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
        }


        //loading from json and adding all the camps the the select option on the top
        var campsList;
        $http.get('../json/camps.json').then(function(json){
            for(var i=0 ;i<json.data.camps.length;i++){
                if(i==0){
                    campsList +="<option selected=\"selected\" value=\""+json.data.camps[i].name+","
                                                    +json.data.camps[i].lat+","
                                                    +json.data.camps[i].lng+"\">"
                                                    +json.data.camps[i].camp+"</option>";
                }
                else{
                    campsList +="<option value=\""+json.data.camps[i].name+","
                                                +json.data.camps[i].lat+","
                                                +json.data.camps[i].lng+"\">"
                                                +json.data.camps[i].camp+"</option>";
                }      
            }
            $("#campsList").append(campsList);
        });

        $scope.changeCamp = function(newCamp){
            var res = newCamp.split(",");
            userCamp = res[1];
            map.panTo(new google.maps.LatLng(res[1],res[2]));
        }

        $("#close-intro").click(function() {
            $("#bgvid").animate({top: '-1500px'});
            $("#close-intro").css( "display", "none" );
            setTimeout(function(){$("#map-canvas").css({"zIndex": 0});},1000);
        });



    }]);