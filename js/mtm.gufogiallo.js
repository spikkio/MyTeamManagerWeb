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
	
	
	//Event handlers
	
	loginHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		var username = jQuery( "#usernameInput" ).val();
		var password = jQuery( "#passwordInput" ).val();
		//Show loading modal
		mtmGufogiallo.showLoadingModal();
		mtmGufogiallo.data.login( username, password, function( result ) {
			mtmGufogiallo.hideLoadingModal();
			if ( result instanceof Array )  {
				//Login successful - prepare view
				mtmGufogiallo.currentUsername = result[ 0 ];
				mtmGufogiallo.currentUserId = result[ 1 ];
				console.log( "logging with username '" + mtmGufogiallo.currentUsername + "'" );
				jQuery( "#loggedUser > span" ).text("Account: " + mtmGufogiallo.currentUsername);
				jQuery( "#loggedUser" ).show();
				jQuery( "#logoutButton" ).show();
				jQuery("#navDiv").show();
				jQuery( "#loginDiv > form > div").removeClass( "has-error" );
				mtmGufogiallo.controller.appController.setLocation( "#/" );
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
		mtmGufogiallo.currentUsername = null;
		mtmGufogiallo.currentUserId = null;
		mtmGufogiallo.currentTeamId = null;
		mtmGufogiallo.controller.appController.setLocation( "#/login" );
	},
	
	//initialization
	init: function() {
		//Initialize data component
		mtmGufogiallo.data.init();
		//Initialize controller component
		mtmGufogiallo.controller.init();
		
		console.log( "ready!" );
	}
};
