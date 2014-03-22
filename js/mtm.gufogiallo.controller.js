mtmGufogiallo.namespace("controller");


mtmGufogiallo.controller.init = function() {
	mtmGufogiallo.controller.appController = Sammy( "#workAreaDiv", function() {
		//console.log("Sammy controller initialized");
		//configure Mustache plugin
		this.use( "Mustache");
		var $workAreaDiv = jQuery("#workAreaDiv");
		
		this.get('#/', function( context ) {
			console.log("Controller: home page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#homePaneAnchor" ).addClass( "active" );
				
				//***TODO*** Questa query ha ancora senso?
				/*
				mtmGufogiallo.data.getTeamIdAndName( mtmGufogiallo.currentUser.id, 
					function success ( result ) {
						mtmGufogiallo.currentUser.team = {};
						mtmGufogiallo.currentUser.team.id = result[ 0 ];
						mtmGufogiallo.currentUser.team.name = result[ 1 ];					
					},
					function failure ( errorCode) {
						console.log( "Error!!!" + errorCode );
					}
				);*/
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/homePane.mustache', { paneName: 'Home' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
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
			
			function updateView() {
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/teamPane.mustache', 
					{ 
						"paneName": "Team", 
						"teamId": mtmGufogiallo.currentUser.team.id,
						"goalkeepers": mtmGufogiallo.currentUser.team.players.goalkeepers,
						"defenders": mtmGufogiallo.currentUser.team.players.defenders,
						"midfielders": mtmGufogiallo.currentUser.team.players.midfielders,
						"forwards": mtmGufogiallo.currentUser.team.players.forwards
					})
					.swap( context.$element() )
					.then( 
						function() {
							$workAreaDiv.fadeIn( "fast" );
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
						}
					);		
			}			
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#teamPaneAnchor" ).addClass( "active" );
				
				if ( typeof( mtmGufogiallo.currentUser.team.players ) === "undefined" ) {
					//the players in the team are unknown: request them to the data layer and assign the result to the model
					mtmGufogiallo.controller.showLoadingModal();
					mtmGufogiallo.data.getTeam( mtmGufogiallo.currentUser.team.id, 
						function success ( result ) {
							mtmGufogiallo.currentUser.team.name = result[ 0 ];
							teamPlayers = result[ 1 ];
							//parse the list of teamPlayers to detect players' role
							goalkeepers = jQuery.grep( teamPlayers, function( player ) {
							   return player.role === 0;
							});
							defenders = jQuery.grep( teamPlayers, function( player ) {
							   return player.role === 1;
							});
							midfielders = jQuery.grep( teamPlayers, function( player ) {
							   return player.role === 2;
							});
							forwards = jQuery.grep( teamPlayers, function( player ) {
							   return player.role === 3;
							});
							
							mtmGufogiallo.currentUser.team.players = {};							
							mtmGufogiallo.currentUser.team.players.goalkeepers = goalkeepers;
							mtmGufogiallo.currentUser.team.players.defenders = defenders;
							mtmGufogiallo.currentUser.team.players.midfielders = midfielders;
							mtmGufogiallo.currentUser.team.players.forwards = forwards;
							updateView();
						},
						function failure ( errorCode) {
							console.log( "Error!!!" + errorCode );
						}
					);
					mtmGufogiallo.controller.hideLoadingModal();
				} else {
					updateView();					
				}
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/match', function( context ) {
			console.log( "Controller: match page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#matchPaneAnchor" ).addClass( "active" );
				
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/matchPane.mustache', { "paneName": 'Match' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/training', function( context ) {
			console.log( "Controller: training page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#trainingPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/trainingPane.mustache', { "paneName": 'Training' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/message', function( context ) {
			console.log( "Controller: message page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#messagePaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/messagePane.mustache', { "paneName": 'Message' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/facebook', function( context ) {
			console.log( "Controller: facebook page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#facebookPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/facebookPane.mustache', { "paneName": 'Facebook' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		
		this.get('#/settings', function( context ) {
			console.log( "Controller: settings page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#settingsPaneAnchor" ).addClass( "active" );
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/settingsPane.mustache', { "paneName": 'Settings' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo(0, 0);	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.get('#/addPlayer', function( context ) {
			console.log( "Controller: addPlayer page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/addPlayer.mustache', { "paneName": 'Add player' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo( 0, 0 );
						//Form input masking
						jQuery(":input").inputmask();
						// Form validation
						jQuery( "#birthdate" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.invalidBirthdateMessage");
						});
						jQuery( "#lastName" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.requiredFieldMessage");
						});
						
						//Event handlers - wiring						
						//jQuery( "#savePlayerButton" ).on( "click",  mtmGufogiallo.controller.savePlayerHandler );
						jQuery( "#savePlayerButton" ).on( "click",  jQuery.validate(
							{
								form: "#addPlayerForm",
								modules : "date, security",
								validateOnBlur : true,
								onError: function() {
									console.log( "validation failed" );
									//scroll vertically to input field where the validation error is
									window.scrollTo( 0, jQuery( ".error" ).scrollTop() );
								},
								onSuccess: function() {
									console.log( "validation succeded" );
									mtmGufogiallo.controller.savePlayerHandler( jQuery.Event( "click" ) );
								}
							}
						));
						jQuery( "#cancelAddPlayerButton" ).on( "click",  mtmGufogiallo.controller.cancelAddPlayerHandler );	
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
			if ( mtmGufogiallo.currentUser !== null ) {
	
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				var playerId = window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1];
				//console.log("EDIT: "+ window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1])
				
				//Search for the player id within the team players in the model
				var selectedPlayer = [].concat(
					mtmGufogiallo.currentUser.team.players.goalkeepers,
					mtmGufogiallo.currentUser.team.players.defenders,
					mtmGufogiallo.currentUser.team.players.midfielders,
					mtmGufogiallo.currentUser.team.players.forwards
				).filter( function (player) { return player.id == playerId } )[ 0 ];
				console.log ( selectedPlayer );

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
				
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/editPlayer.mustache', 
				{ 
					"paneName": 'Edit player',
					"selectedPlayer": selectedPlayer
				})
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo( 0, 0 );
						//Form input masking
						jQuery(":input").inputmask();
						// Form validation
						jQuery( "#birthdate" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.invalidBirthdateMessage");
						});
						jQuery( "#lastName" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.requiredFieldMessage");
						});
						//Event handlers - wiring						
						//jQuery( "#savePlayerButton" ).on( "click",  mtmGufogiallo.controller.savePlayerHandler );
						jQuery( "#updatePlayerButton" ).on( "click",  jQuery.validate(
							{
								form: "#editPlayerForm",
								modules : "date, security",
								validateOnBlur : true,
								onError: function() {
									console.log( "validation failed" );
									//scroll vertically to input field where the validation error is
									window.scrollTo( 0, jQuery( ".error" ).scrollTop() );
								},
								onSuccess: function() {
									console.log( "validation succeded" );
									mtmGufogiallo.controller.updatePlayerHandler( jQuery.Event( "click" ), selectedPlayer.id );
								}
							}
						));
						jQuery( "#deletePlayerButton" ).on( "click", selectedPlayer.id );
						jQuery( "#cancelEditPlayerButton" ).on( "click",  mtmGufogiallo.controller.cancelEditPlayerHandler );	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.post('#/editPlayer', function( context ) {
			console.log( "Controller: addPlayer POST" );
			mtmGufogiallo.controller.appController.setLocation( "#/team" );
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
 * Shows an alert with customizable text that fades in, stays and then fades out
 *
 * @function 
 * @param titleType - should be something like "infoModal.titleTypeError", as per locale file
 * @param messageType - should be something like "alert.messagePlayerAdded", as per locale file
 * @param additionalData - a parameter that is not dependent on the localization
 */
mtmGufogiallo.controller.showAlert = function ( messageType, additionalData ) {
	//messageType should be something like "alert.messagePlayerAdded", as per locale file
	$( "#appFrameDiv" ).prepend( '<div id="alert" class="alert alert-info"></div>' );
	var $alert = jQuery( "#alert" );
	$alert.attr( "data-i18n", messageType );
	$alert.i18n();
	//if 'additionalData' has been provided, then add it  to the text to be shown 
	if ( typeof additionalData !== "undefined" ) {
		$alert.text( $alert.text() + additionalData );
	}
	$alert.hide().fadeIn(1000, function() {
		$(this).delay(1000).fadeOut( 1000);
	});
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
	mtmGufogiallo.data.login( username, password, 
		function success( result ) {
			//Login successful - prepare view
			mtmGufogiallo.controller.hideLoadingModal();
			mtmGufogiallo.currentUser = {};
			mtmGufogiallo.currentUser.username = result[ 0 ];
			mtmGufogiallo.currentUser.id = result[ 1 ];
			mtmGufogiallo.currentUser.team = {}
			mtmGufogiallo.currentUser.team.id = result[ 2 ];
			console.log( "logging with username '" + mtmGufogiallo.currentUser.username + "'" );
			jQuery( "#loggedUserName" ).text( mtmGufogiallo.currentUser.username );
			jQuery( "#loggedUser" ).show();
			jQuery( "#logoutButton" ).show();
			jQuery("#navDiv").show();
			jQuery( "#loginDiv > form > div").removeClass( "has-error" );
			mtmGufogiallo.controller.appController.setLocation( "#/" );
		}, 
		function failure( errorCode ) {
			//Login failed
			mtmGufogiallo.controller.hideLoadingModal();
			jQuery( "#loginDiv > form > div").addClass( "has-error" );
			jQuery( "#usernameInput").popover('show');
		}
	);		
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
	mtmGufogiallo.currentUser = null;
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
		gamesPlayed: 0,
		goalsScored: 0,
		teamId: mtmGufogiallo.currentUser.team.id
	}
	mtmGufogiallo.data.addPlayer( newPlayer, 
		function success( result ) {
			//New player has been saved
			console.log( "New player saved with ID: " + result );			
			newPlayer.id = result;
			switch(newPlayer.role)
			{
				case 0:
					//Added a goalkeeper
					if ( typeof( mtmGufogiallo.currentUser.team.players.goalkeepers ) === "undefined" ) {
						//this is our first goalkeeper, so let's initialize the goalkeepers array
						mtmGufogiallo.currentUser.team.players.goalkeepers = [];
					}		
					mtmGufogiallo.currentUser.team.players.goalkeepers.push(newPlayer);
					break;
				case 1:
					//Added a defender
					if ( typeof( mtmGufogiallo.currentUser.team.players.defenders ) === "undefined" ) {
						//this is our first defender, so let's initialize the defenders array
						mtmGufogiallo.currentUser.team.players.defenders = [];
					}		
					mtmGufogiallo.currentUser.team.players.defenders.push(newPlayer);
					break;
				case 2:
					//Added a midfielder
					if ( typeof( mtmGufogiallo.currentUser.team.players.midfielders ) === "undefined" ) {
						//this is our first midfielder, so let's initialize the midfielders array
						mtmGufogiallo.currentUser.team.players.midfielders = [];
					}		
					mtmGufogiallo.currentUser.team.players.midfielders.push(newPlayer);
					break;
				case 3:
					//Added a forward
					if ( typeof( mtmGufogiallo.currentUser.team.players.forwards ) === "undefined" ) {
						//this is our first forward, so let's initialize the forwards array
						mtmGufogiallo.currentUser.team.players.forwards = [];
					}		
					mtmGufogiallo.currentUser.team.players.forwards.push(newPlayer);
					break;
				default:
			}
			//mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeInfo", "infoModal.messagePlayerAdded" );
		
			mtmGufogiallo.controller.refreshUI( "#/team" );
			mtmGufogiallo.controller.showAlert( "alert.messagePlayerAdded",  newPlayer.id );
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
		}
	);
};


mtmGufogiallo.controller.updatePlayerHandler = function( event, playerId ) {
	event.preventDefault();
	event.stopPropagation();
	var birthdateString = jQuery( "#birthdate" ).val();
	var updatedPlayerData = {
		lastName: jQuery( "#lastName" ).val(),
		firstName: jQuery( "#firstName" ).val(),
		phoneNumber: jQuery( "#phoneNumber" ).val(),
		emailAddress: jQuery( "#emailAddress" ).val(),
		role: Number(jQuery( "#role" ).find(":selected").attr("value")),
		shirtNumber: Number(jQuery( "#shirtNumber" ).find(":selected").attr("value")),
		birthdateLong: new Date( birthdateString.split("/")[2], birthdateString.split("/")[1] , birthdateString.split("/")[0], 0, 0, 0, 0).getTime(),
	}
	mtmGufogiallo.data.updatePlayer( playerId, updatedPlayerData, 
		function success( result ) {
			//Player has been successfully updated
			console.log( "Player has been successfully updated" );			
			updatedPlayerData.id = result;
			/***TODO*** Handle case where the player role has changed!! */
			
			function updateData ( playerArray, index ) {
				playerArray[ index ].lastName = updatedPlayerData.lastName;
				playerArray[ index ].firstName = updatedPlayerData.firstName;
				playerArray[ index ].phoneNumber = updatedPlayerData.phoneNumber;
				playerArray[ index ].emailAddress = updatedPlayerData.emailAddress;
				playerArray[ index ].shirtNumber = updatedPlayerData.shirtNumber;
				playerArray[ index ].birthDate = updatedPlayerData.birthdateLong;
			}
			
			if ( typeof (mtmGufogiallo.currentUser.team.players.goalkeepers) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.goalkeepers.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.team.players.goalkeepers[i].id == playerId )
							{
								//mtmGufogiallo.currentUser.team.players.goalkeepers.splice( i, 1);
								updateData( mtmGufogiallo.currentUser.team.players.goalkeepers, i );
							}
					}
			}
			if ( typeof (mtmGufogiallo.currentUser.team.players.defenders) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.defenders.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.team.players.defenders[i].id == playerId )
							{
								//mtmGufogiallo.currentUser.team.players.defenders.splice( i, 1);
								updateData( mtmGufogiallo.currentUser.team.players.defenders, i );
							}
					}
			}
			if ( typeof (mtmGufogiallo.currentUser.team.players.midfielders) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.midfielders.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.team.players.midfielders[i].id == playerId )
							{
								//mtmGufogiallo.currentUser.team.players.midfielders.splice( i, 1);
								updateData( mtmGufogiallo.currentUser.team.players.midfielders, i );
							}
					}
			}			
			if ( typeof (mtmGufogiallo.currentUser.team.players.forwards) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.forwards.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.team.players.forwards[i].id == playerId )
							{
								//mtmGufogiallo.currentUser.team.players.forwards.splice( i, 1);
								updateData( mtmGufogiallo.currentUser.team.players.forwards, i );
							}
					}
			}				

			mtmGufogiallo.controller.refreshUI( "#/team" );
			mtmGufogiallo.controller.showAlert( "alert.messagePlayerUpdated");
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
		}
	);
};


mtmGufogiallo.controller.deletePlayerHandler = function( event, playerId ) {
	event.preventDefault();
	event.stopPropagation();
	/***TODO***/
}

mtmGufogiallo.controller.cancelAddPlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/team" );
};


mtmGufogiallo.controller.cancelEditPlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/team" );
};


mtmGufogiallo.controller.refreshUI = function( targetLocation ) {
	if ( targetLocation !== window.location.hash ) {
		//View has moved to a different page: no need to do anything
	} else {
		//View must be updated: force a redirect to the target page
		mtmGufogiallo.controller.appController.refresh();
	}
};

