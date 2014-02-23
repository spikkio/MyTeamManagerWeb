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
				
				mtmGufogiallo.data.getTeamId( mtmGufogiallo.currentUserId, function( result ) {
					mtmGufogiallo.currentTeamId = result;
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
						content: "Unknown user and/or password mismatch",
					});
				});
		});
	
	
		this.get('#/team', function( context ) {
			console.log( "Controller: team page" );
			//Check login status
			if ( mtmGufogiallo.currentUserId !== null ) {
				//set active state of navigation button
				jQuery( "#navDiv .active" ).removeClass( "active" );
				jQuery( "#teamPaneAnchor" ).addClass( "active" );
				
				if ( mtmGufogiallo.currentTeamId !== null ) {
					mtmGufogiallo.data.getTeam( mtmGufogiallo.currentTeamId, function( result ) {
						alert( "Found " + result.length + " players in this team");
					});
				}
				//show selectedPane
				context.render( 'templates/teamPane.mustache', { 
					"paneName": "Team", 
					"teamId": mtmGufogiallo.currentTeamId } )
						.swap( context.$element() );
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
		
		this.get(/.*/, function( context ) {
			console.log( "Controller: 'catch-all' method" );
			//set active state of navigation button
			mtmGufogiallo.controller.appController.setLocation( "#/" );
		});
		
	});
	
	mtmGufogiallo.controller.appController.run( '#/' );
};
