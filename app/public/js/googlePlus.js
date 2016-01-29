
// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail());

//   var fullName = profile.getName().split(" ");
//   var first = fullName[0];
//   var last = fullName[1];

//   $("#user-image").css("background-image", "url("+profile.getImageUrl()+")");
//   $("#userName").val(first);
//   $("#userLastName").val(last);
//   $("#google-signout-button").css("display","block");
//   $("#google-signin-button").css("display","none");
//   //alert(profile.getName()+" "+profile.getEmail()+" "+profile.getImageUrl());
// }

// function onLoad() {
// 	gapi.load('auth2,signin2', function() {
// 		var auth2 = gapi.auth2.init();
// 		auth2.then(function() {
// 			// Current values
// 			var isSignedIn = auth2.isSignedIn.get();
// 			var currentUser = auth2.currentUser.get();

// 			if (!isSignedIn) {
// 			    // Rendering g-signin2 button.
// 			    gapi.signin2.render('google-signin-button', {'onsuccess': 'onSignIn'});
// 			    $("#google-signout-button").css("display","none");
// 			}
// 		});
// 	});
// }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	console.log('User signed out.');
  		$("#user-image").css("background-image", "url()");
  		$("#userName").val("");
 		$("#userLastName").val("");
		$("#google-signout-button").css("display","none");
		$("#google-signin-button").css("display","block");
    });
} 
