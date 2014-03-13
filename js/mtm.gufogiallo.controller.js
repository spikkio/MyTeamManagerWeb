mtmGufogiallo.namespace("controller");


mtmGufogiallo.controller.init = function() {
	mtmGufogiallo.controller.appController = Sammy( "#workAreaDiv", function() {
		//console.log("Sammy controller initialized");
		//configure Mustache plugin
		this.use( "Mustache");
		
		this.get('#/', function( context ) {
			console.log("Controller: home page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#homePaneAnchor" ).addClass( "active" );
				
				//mtmGufogiallo.data.getTeamId( mtmGufogiallo.currentUserId, function( result ) {
				mtmGufogiallo.data.getTeamIdAndName( mtmGufogiallo.currentUserId, function( result ) {
					mtmGufogiallo.currentTeamId = result[ 0 ];
					mtmGufogiallo.currentTeamName = result[ 1 ];
					//console.log( "TeamId: " + mtmGufogiallo.currentTeamId + ", myTeamName: " +  mtmGufogiallo.currentTeamName);
					
				});
				
				//show selectedPane
				context.render( 'templates/homePane.mustache', { paneName: 'Home' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/login" );
			}
		});
		
		
		this.get('#/login', function( context ) {
			console.log("Controller: login page" );
			jQuery("#loggedUser").hide();
			jQuery("#logoutButton").hide();
			jQuery("#navDiv").hide();
			
			//show login form
			context.render( 'templates/loginForm.mustache', { } )
				.swap( context.$element() )
				.then( function() {
					window.scrollTo(0, 0);	
					//Event handlers - wiring
					jQuery( "#loginButton" ).on( "click", mtmGufogiallo.controller.loginHandler ) ;

					jQuery( "#logoutButton" ).on( "click", mtmGufogiallo.controller.logoutHandler );

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
						//content: "Unknown user and/or password mismatch"
						content: function() {
							return i18n.t("loginLabel.popoverText");
						}
					});
				});
		});
	
	
		this.get('#/team', function( context ) {
			console.log( "Controller: team page" );
			var teamPlayers = null;
			var goalkeepers = null;
			var defenders = null;
			var midfielders = null;
			var forwards = null;
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#teamPaneAnchor" ).addClass( "active" );
				
				if ( mtmGufogiallo.currentTeamId !== null ) {
					mtmGufogiallo.controller.showLoadingModal();
					mtmGufogiallo.data.getTeamPlayers( mtmGufogiallo.currentTeamId, function( result ) {
						//alert( "Found " + result.length + " players in this team");
						teamPlayers = result;
						
						//parse teamPlayers list to detect players' role
						goalkeepers = jQuery.grep( teamPlayers, function( player ) {
						   return player.attributes.role === 0;
						});
						defenders = jQuery.grep( teamPlayers, function( player ) {
						   return player.attributes.role === 1;
						});
						midfielders = jQuery.grep( teamPlayers, function( player ) {
						   return player.attributes.role === 2;
						});
						forwards = jQuery.grep( teamPlayers, function( player ) {
						   return player.attributes.role === 3;
						});

						//show selectedPane
						context.render( 'templates/teamPane.mustache', { 
							"paneName": "Team", 
							"teamId": mtmGufogiallo.currentTeamId,
							"goalkeepers": goalkeepers,
							"defenders": defenders,
							"midfielders": midfielders,
							"forwards": forwards
						})
							.swap( context.$element() )
							.then( function() {
								window.scrollTo(0, 0);
								jQuery( "#addPlayerButton" ).on( "click", mtmGufogiallo.controller.addPlayerHandler ) ;
								jQuery( "#teamGoalkeepersTable" ).tablesorter({
									headers: { 
										//disable sorting on  'rating' (column 4)
										4: { sorter: false } 
									} 
								});
								jQuery( "#teamDefendersTable" ).tablesorter({
									headers: { 
										//disable sorting on  'rating' (column 4)
										4: { sorter: false } 
									} 
								});
								jQuery( "#teamMidfieldersTable" ).tablesorter({
									headers: { 
										//disable sorting on  'rating' (column 4)
										4: { sorter: false }  
									} 
								});
								jQuery( "#teamForwardsTable" ).tablesorter({
									headers: { 
										//disable sorting on  'rating' (column 4)
										4: { sorter: false } 
									} 
								});
							});
					});
					mtmGufogiallo.controller.hideLoadingModal();
				}
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/match', function( context ) {
			console.log( "Controller: match page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#matchPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				context.render( 'templates/matchPane.mustache', { "paneName": 'Match' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/training', function( context ) {
			console.log( "Controller: training page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#trainingPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				context.render( 'templates/trainingPane.mustache', { "paneName": 'Training' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/message', function( context ) {
			console.log( "Controller: message page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#messagePaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				context.render( 'templates/messagePane.mustache', { "paneName": 'Message' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/facebook', function( context ) {
			console.log( "Controller: facebook page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#facebookPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				context.render( 'templates/facebookPane.mustache', { "paneName": 'Facebook' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/settings', function( context ) {
			console.log( "Controller: settings page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#settingsPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				context.render( 'templates/settingsPane.mustache', { "paneName": 'Settings' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.get('#/addPlayer', function( context ) {
			console.log( "Controller: addPlayer page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
							
				//show selectedPane
				context.render( 'templates/addPlayer.mustache', { "paneName": 'Add player' } )
					.swap( context.$element() )
					.then( function() {
						window.scrollTo( 0, 0 );
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.post('#/addPlayer', function( context ) {
			console.log( "Controller: addPlayer POST" );
			mtmGufogiallo.controller.appController.setLocation( "#/team" );
		});
		
		this.get('#/editPlayer', function( context ) {
			console.log( "Controller: editPlayer page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
							
				//show selectedPane
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				console.log("EDIT: "+ window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1])
				/*
				// Read a page's GET URL variables and return them as an associative array.
				function getUrlVars()
				{
					var vars = [], hash;
					var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
					for(var i = 0; i < hashes.length; i++)
					{
						hash = hashes[i].split('=');
						vars.push(hash[0]);
						vars[hash[0]] = hash[1];
					}
					return vars;
				}
				*/
				context.render( 'templates/editPlayer.mustache', { "paneName": 'Edit player' } )
					.swap( context.$element() );
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.get(/.*/, function( context ) {
			console.log( "Controller: 'catch-all' method" );
			//set active state of navigation button
			mtmGufogiallo.controller.appController.setLocation( "#/" );
		});
		
	});
	
	mtmGufogiallo.controller.appController.run( '#/' );
};

//eventHandlers
/**
 * Shows a modal while loading resources
 *
 * @function 
 */
mtmGufogiallo.controller.showLoadingModal = function () {
	jQuery( "#loadingModal" ).modal();
};


/**
 * Hides the modal while loading resources
 *
 * @function 
 */  
mtmGufogiallo.controller.hideLoadingModal = function () {
	jQuery( "#loadingModal" ).modal( 'hide' );
};


/**
 * Shows a modal with customizable text
 *
 * @function 
 * @param titleType - should be something like "infoModal.titleTypeError", as per locale file
 * @param messageType - should be something like "infoModal.messageType1", as per locale file
 * @param redirectTargetPage - a URL where the app will be redirected after the modal is closed
 */
mtmGufogiallo.controller.showInfoModal = function ( titleType, messageType, redirectTargetPage) {
	//titleType should be something like "infoModal.titleType1", as per locale file
	//messageType should be something like "infoModal.messageType1", as per locale file
	jQuery( "#infoModal .modal-header h4").attr( "data-i18n", titleType );
	jQuery( "#infoModal .modal-body p").attr( "data-i18n", messageType );
	jQuery( "#infoModal .modal-footer button").on( "click", function( event ) {
		jQuery( "#infoModal" ).modal( 'hide' );
		if ( redirectTargetPage ) { // has a redirect page been specified? Then go there
			mtmGufogiallo.controller.appController.setLocation( redirectTargetPage );
		}
	});
	jQuery( "#infoModal" ).i18n();
	jQuery( "#infoModal" ).modal();
};


/**
 * Handles the login process
 * 
 * @function 
 * @param event - the event to be handled
 */
mtmGufogiallo.controller.loginHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	var username = jQuery( "#usernameInput" ).val();
	var password = jQuery( "#passwordInput" ).val();
	//Show loading modal
	mtmGufogiallo.controller.showLoadingModal();
	mtmGufogiallo.data.login( username, password, function( result ) {
		mtmGufogiallo.controller.hideLoadingModal();
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
};

/**
 * Handles the logout process
 * 
 * @function 
 * @param event - the event to be handled
 */
mtmGufogiallo.controller.logoutHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	//Reset view and logout
	mtmGufogiallo.currentUsername = null;
	mtmGufogiallo.currentUserId = null;
	mtmGufogiallo.currentTeamId = null;
	mtmGufogiallo.currentTeamName = null;
	mtmGufogiallo.controller.appController.setLocation( "#/login" );
};

/**
 * Handles the creation of a new player
 * 
 * @function 
 * @param event - the event to be handled
 */
mtmGufogiallo.controller.addPlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/addPlayer" );
};

mtmGufogiallo.controller.savePlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	var birthdateString = jQuery( "#birthdate" ).val();
	var newPlayer = {
		lastName: jQuery( "#lastName" ).val(),
		firstName: jQuery( "#firstName" ).val(),
		phoneNumber: jQuery( "#phoneNumber" ).val(),
		emailAddress: jQuery( "#emailAddress" ).val(),
		role: Number(jQuery( "#role" ).find(":selected").attr("value")),
		shirtNumber: Number(jQuery( "#shirtNumber" ).find(":selected").attr("value")),
		birthdateLong: new Date( birthdateString.split("/")[2], birthdateString.split("/")[1] , birthdateString.split("/")[0], 0, 0, 0, 0).getTime(),
		eventPresencesNumber: 0,
		rating: 0,
		teamId: mtmGufogiallo.currentTeamId
	}
	mtmGufogiallo.data.addPlayer( newPlayer, 
		function success( result ) {
			//New player has been saved
			console.log( "New player saved with ID: " + result );
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeInfo", "infoModal.messagePlayerAdded" );
			//mtmGufogiallo.controller.appController.setLocation( "#/team" );			
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
			//mtmGufogiallo.controller.appController.setLocation( "#/team" );
		}
	);
};

mtmGufogiallo.controller.cancelAddPlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/team" );
};
