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
					.swap( context.$element() );
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
					//Event handlers - wiring
					jQuery( "#loginButton" ).on( "click", mtmGufogiallo.loginHandler ) ;

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
					mtmGufogiallo.showLoadingModal();
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
								jQuery( "#addPlayerButton" ).on( "click", mtmGufogiallo.addPlayerHandler ) ;
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
					mtmGufogiallo.hideLoadingModal();
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
					.swap( context.$element() );
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
					.swap( context.$element() );
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
					.swap( context.$element() );
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
					.swap( context.$element() );
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
					.swap( context.$element() );
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
					.swap( context.$element() );
			} else {
				mtmGufogiallo.controller.appController.setLocation( "#/" );
			}
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
