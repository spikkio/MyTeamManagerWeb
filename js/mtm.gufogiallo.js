var mtmGufogiallo = {

	currentUsername:  null,
	currentUserId: null,
	currentTeamId: null,
	currentTeamName : null,
	
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
	
	showErrorModal: function ( errorType, redirectTargetPage) {
		//errorType should be something like "errorModal.errorType1", as per locale file
		jQuery( "#errorModal .modal-body p").attr( "data-i18n", errorType );
		jQuery( "#errorModal .modal-footer button").on( "click", function( event ) {
			jQuery( "#errorModal" ).modal( 'hide' );
			if ( redirectTargetPage ) { // has a redirect page been specified? Then go there
				mtmGufogiallo.controller.appController.setLocation( redirectTargetPage );
			}
		});
        jQuery( "#errorModal" ).modal();
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
				jQuery( "#loggedUserName" ).text( mtmGufogiallo.currentUsername );
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
		mtmGufogiallo.currentTeamName = null;
		mtmGufogiallo.controller.appController.setLocation( "#/login" );
	},
	
	addPlayerHandler: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		
		mtmGufogiallo.controller.appController.setLocation( "#/addPlayer" );
		
	},
	
	//initialization
	init: function() {
	
		//Localization via i18n
		i18n.init( function(t) {
			// translate UI components
			jQuery("#loginDiv").i18n();
			jQuery("#headerDiv").i18n();
			jQuery("#navDiv").i18n();
			jQuery("#loadingModal").i18n();
			jQuery("#errorModal").i18n();
			
			var appName = t("app.name");
		});
		//Initialize data component
		mtmGufogiallo.data.init();
		//Initialize controller component
		mtmGufogiallo.controller.init();
		console.log( "ready!" );
	}
};
