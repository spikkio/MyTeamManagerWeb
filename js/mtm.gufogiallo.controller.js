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
						"goalkeepers": jQuery.grep( mtmGufogiallo.currentUser.team.players, function( player ) {
								//round the rating visually to the nearest 0.5 (i.e. number fo stars)
								player.rating = Math.round(player.rating*2)/2;
								return player.role === 0;
							}),
						"defenders": jQuery.grep( mtmGufogiallo.currentUser.team.players, function( player ) {
								//round the rating visually to the nearest 0.5 (i.e. number fo stars)
								player.rating = Math.round(player.rating*2)/2;
								return player.role === 1;
							}),
						"midfielders": jQuery.grep( mtmGufogiallo.currentUser.team.players, function( player ) {
								//round the rating visually to the nearest 0.5 (i.e. number fo stars)
								player.rating = Math.round(player.rating*2)/2;
								return player.role === 2;
							}),
						"forwards": jQuery.grep( mtmGufogiallo.currentUser.team.players, function( player ) {
								//round the rating visually to the nearest 0.5 (i.e. number fo stars)
								player.rating = Math.round(player.rating*2)/2;
								return player.role === 3;
							})
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
							mtmGufogiallo.currentUser.team.players = result[ 1 ];
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
			
			function updateView() {
				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/trainingPane.mustache', 
					{ 
						"paneName": "Training", 
						"teamId": mtmGufogiallo.currentUser.team.id,
						"trainings": mtmGufogiallo.currentUser.trainings
					})
					.swap( context.$element() )
					.then( 
						function() {
							$workAreaDiv.fadeIn( "fast" );
							window.scrollTo(0, 0);
							jQuery( "#trainingTable" ).tablesorter( {
								dateFormat: "uk",
								sortList: [[0,0]]
							} );
							jQuery( "#addTrainingButton" ).on( "click", mtmGufogiallo.controller.addTrainingHandler ) ;
						}
					);		
			}
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#trainingPaneAnchor" ).addClass( "active" );
				if ( typeof( mtmGufogiallo.currentUser.trainings ) === "undefined" ) {
					//the trainings are unknown yet: request them to the data layer and assign the result to the model
					mtmGufogiallo.controller.showLoadingModal();
					mtmGufogiallo.data.getTrainings( mtmGufogiallo.currentUser.team.id, 
						function success ( result ) {
							mtmGufogiallo.currentUser.trainings = result;
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
				//$workAreaDiv.hide();
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
				var selectedPlayer = mtmGufogiallo.currentUser.team.players.filter( function (player) { 
					return player.id == playerId 
				})[ 0 ];
				console.log ( selectedPlayer );
				
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
						jQuery( "#deletePlayerButton" ).on( "click", null, selectedPlayer.id, mtmGufogiallo.controller.deletePlayerHandler );
						jQuery( "#cancelEditPlayerButton" ).on( "click",  mtmGufogiallo.controller.cancelEditPlayerHandler );	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.post('#/editPlayer', function( context ) {
			console.log( "Controller: editPlayer POST" );
			mtmGufogiallo.controller.appController.setLocation( "#/team" );
		});

		this.get('#/addTraining', function( context ) {
			console.log( "Controller: addTraining page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
				//show selectedPane
				//$workAreaDiv.hide();
				context.render( 'templates/addTraining.mustache', { "paneName": 'Add training' } )
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo( 0, 0 );
						//Form input masking
						jQuery(":input").inputmask();
						// Form validation
						jQuery( "#trainingDate" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.invalidDateMessage");
						});
						jQuery( "#trainingDate" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.requiredFieldMessage");
						});
						
						//Event handlers - wiring						
						jQuery( "#saveTrainingButton" ).on( "click",  jQuery.validate(
							{
								form: "#addTrainingForm",
								modules : "date, security",
								validateOnBlur : true,
								onError: function() {
									console.log( "validation failed" );
									//scroll vertically to input field where the validation error is
									window.scrollTo( 0, jQuery( ".error" ).scrollTop() );
								},
								onSuccess: function() {
									console.log( "validation succeded" );
									mtmGufogiallo.controller.saveTrainingHandler( jQuery.Event( "click" ) );
								}
							}
						));
						jQuery( "#cancelAddTrainingButton" ).on( "click",  mtmGufogiallo.controller.cancelAddTrainingHandler );	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.post('#/addTraining', function( context ) {
			console.log( "Controller: addTraining POST" );
			mtmGufogiallo.controller.appController.setLocation( "#/training" );
		});

		this.get('#/editTraining', function( context ) {
			console.log( "Controller: editTraining page" );
			//Check login status
			if ( mtmGufogiallo.currentUser !== null ) {
	
				var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
				var trainingId = window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1];
				
				//Search for the training id within the list of trainings in the model
				var selectedTraining = mtmGufogiallo.currentUser.trainings.filter( function (training) { 
					return training.id == trainingId 
				})[ 0 ];
				console.log ( selectedTraining );

				//show selectedPane
				$workAreaDiv.hide();
				context.render( 'templates/editTraining.mustache', 
				{ 
					"paneName": 'Edit training',
					"selectedTraining": selectedTraining
				})
					.swap( context.$element() )
					.then( function() {
						$workAreaDiv.fadeIn( "fast" );
						window.scrollTo( 0, 0 );
						//Form input masking
						jQuery(":input").inputmask();
						// Form validation
						jQuery( "#trainingDate" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.invalidDateMessage");
						});
						jQuery( "#trainingTime" ).attr( "data-validation-error-msg", function() {
							return i18n.t("formValidation.invalidTimeMessage");
						});
						//Event handlers - wiring						
						//jQuery( "#savePlayerButton" ).on( "click",  mtmGufogiallo.controller.savePlayerHandler );
						jQuery( "#updateTrainingButton" ).on( "click",  jQuery.validate(
							{
								form: "#editTrainingForm",
								modules : "date, security",
								validateOnBlur : true,
								onError: function() {
									console.log( "validation failed" );
									//scroll vertically to input field where the validation error is
									window.scrollTo( 0, jQuery( ".error" ).scrollTop() );
								},
								onSuccess: function() {
									console.log( "validation succeded" );
									mtmGufogiallo.controller.updateTrainingHandler( jQuery.Event( "click" ), selectedTraining.id );
								}
							}
						));
						jQuery( "#deleteTrainingButton" ).on( "click", null, selectedTraining.id, mtmGufogiallo.controller.deleteTrainingHandler );
						jQuery( "#cancelEditTrainingButton" ).on( "click",  mtmGufogiallo.controller.cancelEditTrainingHandler );	
					});
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
		});
		
		this.post('#/editTraining', function( context ) {
			console.log( "Controller: editTraining POST" );
			mtmGufogiallo.controller.appController.setLocation( "#/training" );
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
	jQuery( "#infoModal .modal-footer button").one( "click", function( event ) {
		jQuery( "#infoModal" ).modal( 'hide' );
		if ( redirectTargetPage ) { // has a redirect page been specified? Then go there
			mtmGufogiallo.controller.appController.setLocation( redirectTargetPage );
		}
	});
	jQuery( "#infoModal" ).i18n();
	jQuery( "#infoModal" ).modal();
};


/**
 * Shows a modal with customizable text to confirm an operation before it is applied
 *
 * @function 
 * @param titleType - should be something like "confirmModal.titleTypeAlert", as per locale file
 * @param messageType - should be something like "confirmModal.messageConfirmPlayerDelete", as per locale file
 * @param checkboxText - should be something like "checkboxRecursiveTrainingDelete", as per locale file
 * @param callbackFunction - a function that is invoked when the user confirms
 */
mtmGufogiallo.controller.showConfirmModal = function ( titleType, messageType, checkboxText, callbackFunction) {
	jQuery( "#confirmModal .modal-header h4").attr( "data-i18n", titleType );
	jQuery( "#confirmModal .modal-body p").attr( "data-i18n", messageType );
	var checkboxDiv = jQuery( "#confirmModal .modal-body #confirmModalCheckboxDiv");
	if ( checkboxText ) {
		checkboxDiv.find("span").attr( "data-i18n", checkboxText );
		checkboxDiv.find("input").prop( "checked", false );
		checkboxDiv.css( "display", "block" );
	} else {
		checkboxDiv.css( "display", "none" );
	}
	jQuery( "#confirmModal .modal-footer #confirmButton").one( "click", function( event ) {
		jQuery( "#confirmModal" ).modal( 'hide' );
		//The callback is invoked with the value (true or false) of the checkbox status
		callbackFunction( jQuery( "#confirmModalCheckbox").is(':checked') );
	});
	jQuery( "#confirmModal" ).i18n();
	jQuery( "#confirmModal" ).modal();
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
		birthdateLong: new Date( birthdateString.split("/")[2], birthdateString.split("/")[1] -1 , birthdateString.split("/")[0], 0, 0, 0, 0).getTime(),
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
			if ( typeof( mtmGufogiallo.currentUser.team.players ) === "undefined" ) {
				//this is our first player, so let's initialize the players array
				mtmGufogiallo.currentUser.team.players = [];
			}		
			mtmGufogiallo.currentUser.team.players.push( newPlayer );
		
			//mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeInfo", "infoModal.messagePlayerAdded" );
		
			mtmGufogiallo.controller.refreshUI( "#/team" );
			mtmGufogiallo.controller.showAlert( "toast.messagePlayerAdded",  newPlayer.id );
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
		birthdateLong: new Date( birthdateString.split("/")[2], birthdateString.split("/")[1]-1, birthdateString.split("/")[0], 0, 0, 0, 0).getTime()
	}
	mtmGufogiallo.data.updatePlayer( playerId, updatedPlayerData, 
		function success( result ) {
			//Player has been successfully updated
			console.log( "Player has been successfully updated" );			
			updatedPlayerData.id = result;
			//update player in model
			if ( typeof (mtmGufogiallo.currentUser.team.players) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.team.players[ i ].id == playerId )
							{
								mtmGufogiallo.currentUser.team.players[ i ].lastName = updatedPlayerData.lastName;
								mtmGufogiallo.currentUser.team.players[ i ].firstName = updatedPlayerData.firstName;
								mtmGufogiallo.currentUser.team.players[ i ].phoneNumber = updatedPlayerData.phoneNumber;
								mtmGufogiallo.currentUser.team.players[ i ].emailAddress = updatedPlayerData.emailAddress;
								mtmGufogiallo.currentUser.team.players[ i ].shirtNumber = updatedPlayerData.shirtNumber;
								mtmGufogiallo.currentUser.team.players[ i ].birthDate = updatedPlayerData.birthdateLong;
								mtmGufogiallo.currentUser.team.players[ i ].role = updatedPlayerData.role;
							}
					}
			}
			mtmGufogiallo.controller.refreshUI( "#/team" );
			mtmGufogiallo.controller.showAlert( "toast.messagePlayerUpdated");
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
		}
	);
};


mtmGufogiallo.controller.deletePlayerHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	var playerId = event.data;
	mtmGufogiallo.controller.showConfirmModal( "confirmModal.titleTypeAlert", "confirmModal.messageConfirmPlayerDelete", null, function () {
		mtmGufogiallo.data.deletePlayer( playerId, 
			function success( result ) {
				//Player has been successfully deleted
				console.log( "Player has been successfully deleted" );			
				var deletedPlayerId = result;
				//remove player from model
				if ( typeof (mtmGufogiallo.currentUser.team.players) !== "undefined" ) {
					for ( var i = 0; i < mtmGufogiallo.currentUser.team.players.length; i++ )
						{
							if ( mtmGufogiallo.currentUser.team.players[i].id == playerId )
								{
									mtmGufogiallo.currentUser.team.players.splice( i, 1);
								}
						}
				}
				mtmGufogiallo.controller.appController.setLocation( "#/team" );
				mtmGufogiallo.controller.refreshUI( "#/team" );
				mtmGufogiallo.controller.showAlert( "toast.messagePlayerDeleted", deletedPlayerId );
			}, 
			function failure( errorCode ) {
				//Ouch! We have an error
				mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
			}
		);
	});
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

/**
 * Handles the creation of a new training
 * 
 * @function 
 * @param event - the event to be handled
 */
mtmGufogiallo.controller.addTrainingHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/addTraining" );
};



mtmGufogiallo.controller.cancelAddTrainingHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/training" );
};


mtmGufogiallo.controller.saveTrainingHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();

	var trainingDateString = jQuery( "#trainingDate" ).val();
	var trainingTimeString = jQuery( "#trainingTime" ).val();
	var trainingTimestampLong = new Date( trainingDateString.split("/")[2], trainingDateString.split("/")[1] -1 , trainingDateString.split("/")[0], trainingTimeString.split(":")[0], trainingTimeString.split(":")[1], 0, 0).getTime();
	var location = jQuery( "#location" ).val(); 
	var note = jQuery( "#note" ).val();
	var newTrainings = [];
	var teamId = mtmGufogiallo.currentUser.team.id
	var recurrence = parseInt(jQuery( "#recurrence" ).val());
	var  recurrenceExpireTimestampLong = 0;
	var recurrenceFrequency = null;
	var currentTrainingTimestampLong = null;
	var recurrenceExpireDateString = null;
	var recurrenceExpireTimestampLong = null;
	//newTraining[0] is the parent training, which is populated in any case (i.e. both for single and for recurring trainings)
	newTrainings[0] = {
		timestamp: trainingTimestampLong,	
		location: location,
		note: note,	
		recurrence: recurrence,
	}
	if (recurrence !== 0) { 
		//recurring training: let's check if it is daily or weekly
		if (recurrence === 1) {
			//daily training
			recurrenceFrequency = 86400000; //number of milliseconds in a day
		} else {
			//weekly training
			recurrenceFrequency = 604800000; //number of milliseconds in a week
		}
		currentTrainingTimestampLong = trainingTimestampLong + recurrenceFrequency;
		recurrenceExpireDateString = jQuery( "#trainingRecurrenceExpireDate" ).val();
		recurrenceExpireTimestampLong = new Date( recurrenceExpireDateString.split("/")[2], recurrenceExpireDateString.split("/")[1] -1 , recurrenceExpireDateString.split("/")[0], trainingTimeString.split(":")[0], trainingTimeString.split(":")[1], 0, 0).getTime();
		//set the recurrenceExpireTimestamp for the parent event, according to the value specified by the user
		newTrainings[0].recurrenceExpireTimestamp = recurrenceExpireTimestampLong;
		while ( currentTrainingTimestampLong <= recurrenceExpireTimestampLong) {
			//create child trainings and add them to the newTrainingsArray. Loop ends when reaching or surpassing the recurrence expiration date
			newTrainings.push (
				{
					timestamp: currentTrainingTimestampLong,	
					location: location,
					note: note,
					recurrence: recurrence,
					recurrenceExpireTimestamp: recurrenceExpireTimestampLong
				}
			);
			currentTrainingTimestampLong = currentTrainingTimestampLong + recurrenceFrequency;
		}
	} else {
		//non-recurring event: set the recurrenceExpireTimestamp for the parent (single) event to 0
		newTrainings[0].recurrenceExpireTimestamp = 0;		
	}
	mtmGufogiallo.data.addTraining( newTrainings, teamId,
		function success( result ) {
			//New training(s) have been saved
			console.log( "New training(s) saved with parent ID: " + result[0] );			
			newTrainings[0].id = result[0];
			if ( typeof( mtmGufogiallo.currentUser.trainings ) === "undefined" ) {
				//this is our first  training so let's initialize the trainings array
				mtmGufogiallo.currentUser.trainings = [];
			}
			//add to the model every training specified in newTrainings
			for ( var i=0; i < newTrainings.length; i++ ) {
				mtmGufogiallo.currentUser.trainings.push(
					{
						"id": result[i],
						"location": newTrainings[i].location,
						"note": newTrainings[i].note,
						"repeat": newTrainings[i].recurrence,
						"repeat_end_time": newTrainings[i].recurrenceExpireTimestamp,
						"timestamp": newTrainings[i].timestamp
					}
				);
			}
		
			mtmGufogiallo.controller.refreshUI( "#/training" );
			mtmGufogiallo.controller.showAlert( "toast.messageTrainingAdded",  newTrainings[0].id );
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
		}
	);
};


mtmGufogiallo.controller.updateTrainingHandler = function( event, trainingId ) {
	event.preventDefault();
	event.stopPropagation();
	var trainingDateString = jQuery( "#trainingDate" ).val();
	var trainingTimeString = jQuery( "#trainingTime" ).val();
	var updatedTrainingData = {
		timestamp: new Date( trainingDateString.split("/")[2], trainingDateString.split("/")[1]-1, trainingDateString.split("/")[0], trainingTimeString.split(":")[0], trainingTimeString.split(":")[1], 0, 0).getTime(),
		location: jQuery( "#location" ).val(),
		note: jQuery( "#note" ).val(),
	}
	mtmGufogiallo.data.updateTraining( trainingId, updatedTrainingData, 
		function success( result ) {
			//Training has been successfully updated
			console.log( "Training has been successfully updated" );			
			updatedTrainingData.id = result;
			//update training in model
			if ( typeof (mtmGufogiallo.currentUser.trainings) !== "undefined" ) {
				for ( var i = 0; i < mtmGufogiallo.currentUser.trainings.length; i++ )
					{
						if ( mtmGufogiallo.currentUser.trainings[ i ].id == trainingId )
							{
								mtmGufogiallo.currentUser.trainings[ i ].location = updatedTrainingData.location;
								mtmGufogiallo.currentUser.trainings[ i ].note = updatedTrainingData.note;
								mtmGufogiallo.currentUser.trainings[ i ].timestamp = updatedTrainingData.timestamp;
							}
					}
			}
			mtmGufogiallo.controller.refreshUI( "#/training" );
			mtmGufogiallo.controller.showAlert( "toast.messageTrainingUpdated");
		}, 
		function failure( errorCode ) {
			//Ouch! We have an error
			mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
		}
	);
};

mtmGufogiallo.controller.deleteTrainingHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	var trainingId = event.data;
	mtmGufogiallo.controller.showConfirmModal( "confirmModal.titleTypeAlert", "confirmModal.messageConfirmTrainingDelete", "confirmModal.checkboxRecursiveTrainingDelete", function ( isRecursiveDelete ) {
		mtmGufogiallo.data.deleteTraining( trainingId, isRecursiveDelete, 
			function success( results ) {
				//Training has been successfully deleted
				console.log( "Training(s) have been successfully deleted" );			
				results.forEach( function (deletedTrainingId)  {
					//remove training from model
					if ( typeof (mtmGufogiallo.currentUser.trainings) !== "undefined" ) {
						for ( var i = 0; i < mtmGufogiallo.currentUser.trainings.length; i++ )
							{
								if ( mtmGufogiallo.currentUser.trainings[i].id == deletedTrainingId )
									{
										mtmGufogiallo.currentUser.trainings.splice( i, 1);
									}
							}
					}
				});
				mtmGufogiallo.controller.appController.setLocation( "#/training" );
				mtmGufogiallo.controller.refreshUI( "#/training" );
				mtmGufogiallo.controller.showAlert( "toast.messageTrainingDeleted" );
			}, 
			function failure( errorCode ) {
				//Ouch! We have an error
				mtmGufogiallo.controller.showInfoModal( "infoModal.titleTypeError", "infoModal.messageTypeError1" );
			}
		);
	});
}


mtmGufogiallo.controller.cancelEditTrainingHandler = function( event ) {
	event.preventDefault();
	event.stopPropagation();
	mtmGufogiallo.controller.appController.setLocation( "#/training" );
};


mtmGufogiallo.controller.refreshUI = function( targetLocation ) {
	if ( targetLocation !== window.location.hash ) {
		//View has moved to a different page: no need to do anything
	} else {
		//View must be updated: force a redirect to the target page
		mtmGufogiallo.controller.appController.refresh();
	}
};



