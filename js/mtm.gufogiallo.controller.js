mtmGufogiallo.namespace("controller");

mtmGufogiallo.controller.init = function() {
	var appController = Sammy( "#workAreaDiv", function() {
		//console.log("Sammy controller initialized");
		//configure Mustache plugin
		this.use( "Mustache");
		
		this.get('#/', function( context ) {
			console.log("Controller: home page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#homePaneAnchor" ).addClass( "active" );
			
			if ( mtmGufogiallo.currentUserId !== null ) {
				mtmGufogiallo.data.getTeam( mtmGufogiallo.currentUserId, function( result ) {
					mtmGufogiallo.currentTeamId = result;
				});
			}
			//show selectedPane
			context.render( 'templates/homePane.mustache', { paneName: 'Home' } )
				.swap( context.$element() );
		});
	
		this.get('#/team', function( context ) {
			console.log( "Controller: team page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#teamPaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/teamPane.mustache', { 
				"paneName": "Team", 
				"teamId": mtmGufogiallo.currentTeamId } )
					.swap( context.$element() );
		});
		
		this.get('#/match', function( context ) {
			console.log( "Controller: match page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#matchPaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/matchPane.mustache', { "paneName": 'Match' } )
				.swap( context.$element() );
		});
		
		this.get('#/training', function( context ) {
			console.log( "Controller: training page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#trainingPaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/trainingPane.mustache', { "paneName": 'Training' } )
				.swap( context.$element() );
		});
		
		this.get('#/message', function( context ) {
			console.log( "Controller: message page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#messagePaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/messagePane.mustache', { "paneName": 'Message' } )
				.swap( context.$element() );
		});
		
		this.get('#/facebook', function( context ) {
			console.log( "Controller: facebook page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#facebookPaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/facebookPane.mustache', { "paneName": 'Facebook' } )
				.swap( context.$element() );
		});
		
		this.get('#/settings', function( context ) {
			console.log( "Controller: settings page" );
			//set active state of navigation button
			jQuery( "#navDiv .active" ).removeClass( "active" );
			jQuery( "#settingsPaneAnchor" ).addClass( "active" );
			
			//show selectedPane
			context.render( 'templates/settingsPane.mustache', { "paneName": 'Settings' } )
				.swap( context.$element() );
		});
	});
	
	appController.run( '#/' );
};
