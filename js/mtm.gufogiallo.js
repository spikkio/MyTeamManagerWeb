var mtmGufogiallo = {

	currentUsername:  null,
	currentUserId: null,
	currentTeamId: null,
	
	//Namespace handling function
    namespace: function( ns ) {
        var parts = ns.split( "." ),
            object = this,
            i, len;
        for ( i=0, len=parts.length; i < len; i++ ) {
            if ( !object[ parts[i] ] ) {
                object[ parts[ i ] ] = {};
            }
            object = object[ parts[ i ] ];
        }
        return object;
    },
	
	showLoadingModal: function () {
        jQuery( "#loadingModal" ).modal();
     },
       
	hideLoadingModal: function () {
		jQuery( "#loadingModal" ).modal( 'hide' );
	},
	
	initLoginForm: function () {
		//Event handlers - wiring
		jQuery( "#loginButton" ).on( "click", mtmGufogiallo.loginHandler );
		jQuery( "#logoutButton" ).on( "click", mtmGufogiallo.logoutHandler );
		
		//Popover for wrong username - setup
		jQuery( "#usernameInput" ).on( "focus input", function () {
			jQuery( "#usernameInput" ).popover( 'hide' );
		});
		jQuery( "#passwordInput" ).on( "focus input", function () {
			jQuery( "#usernameInput" ).popover( 'hide' );
		});
		jQuery( "#usernameInput" ).popover({
			animation: true,
			container: "body", 
			placement: "left", 
			trigger: "manual",
			content: "Unknown user and/or password mismatch",
		});
	},
	
	showLoginForm: function () {
		jQuery("#appFrameDiv").hide();
		jQuery("#loggedUser").hide();
		jQuery("#logoutButton").hide();
	},
	
	hideLoginForm: function () {
		jQuery( "#loggedUser > span" ).text("Account: " + mtmGufogiallo.currentUsername);
		jQuery( "#loggedUser" ).show();
		jQuery( "#logoutButton" ).show();
		jQuery( "#loginDiv" ).hide();
		jQuery( "#appFrameDiv" ).show();
	},
	
	//Event handlers
	
	loginHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		
		var username = jQuery( "#usernameInput" ).val();
		var password = jQuery( "#passwordInput" ).val();
		
		
		mtmGufogiallo.showLoadingModal();
		
		mtmGufogiallo.data.login( username, password, function( result ) {
			mtmGufogiallo.hideLoadingModal();
			//if ( typeof result === "string" )  {
			if ( result instanceof Array )  {
				//Login successful - prepare view
				mtmGufogiallo.currentUsername = result[ 0 ];
				mtmGufogiallo.currentUserId = result[ 1 ];
				console.log( "logging with username '" + mtmGufogiallo.currentUsername + "'" );
				mtmGufogiallo.hideLoginForm();
			} else {
				//Login failed
				jQuery( "#loginDiv > form > div").addClass( "has-error" );
				jQuery( "#usernameInput").popover('show');
			}
		});		
	},
		
	logoutHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		
		//Reset view and logout
		currentUsername = null;
		jQuery( "#logoutButton" ).hide();
		jQuery( "#loggedUser" ).hide();
		jQuery( "#appFrameDiv" ).hide();
		jQuery( "#loginDiv > form > div").removeClass( "has-error" );
		jQuery( "#loginDiv" ).show();
	},
	
	//init function
	init: function() {
		//Initialize data component
		mtmGufogiallo.data.init();
		//Initialize controller component
		mtmGufogiallo.controller.init();
		//Initialize login form
		mtmGufogiallo.initLoginForm();
		//Show login form to allow access
		mtmGufogiallo.showLoginForm();
		
		console.log( "ready!" );
	}
};
