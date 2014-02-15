var mtmGufogiallo = {

	currentUser:  null,

	//Event handlers
	
	loginHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		
		var username = jQuery( "#usernameInput").val();
		
	
		//FAKE username for testing
		if ( username === "pippo")  {
			//Login successful
			currentUser = username;
			console.log( "logging with username '" + username +"'");
			
			jQuery( "#loggedUser > span" ).text("Account: " + currentUser);
			jQuery( "#loggedUser" ).show();
			jQuery( "#logoutButton" ).show();
			jQuery( "#loginDiv" ).hide();
			jQuery( "#appFrameDiv" ).show();
		} 
		else {
			//Login failed
			jQuery( "#loginDiv > form > div").addClass( "has-error" );
		
			jQuery( "#usernameInput").popover('show');
		};
	},
	
	logoutHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		
		currentUser = null;
		jQuery( "#logoutButton" ).hide();
		jQuery( "#loggedUser" ).hide();
		jQuery( "#appFrameDiv" ).hide();
		jQuery( "#loginDiv > form > div").removeClass( "has-error" );
		jQuery( "#loginDiv" ).show();
	},
	
	//init function
	init: function() {
		console.log( "ready!" );
		jQuery("#appFrameDiv").hide();
		jQuery("#loggedUser").hide();
		jQuery("#logoutButton").hide();
		
		jQuery( "#loginButton" ).on( "click", mtmGufogiallo.loginHandler );
		jQuery( "#logoutButton" ).on( "click", mtmGufogiallo.logoutHandler );
		jQuery( "#usernameInput" ).on( "focus", function () {
			jQuery( "#usernameInput" ).popover( 'hide' );
		});
		
		
		jQuery( "#usernameInput").popover({
			animation: true,
			container: "body", 
			placement: "left", 
			trigger: "manual",
			content: "Unknown user",
		});
	}
	
};
