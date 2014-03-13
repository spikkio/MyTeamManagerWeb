mtmGufogiallo.namespace("data");

mtmGufogiallo.data.init = function() {
	Parse.initialize("MXUjHyEvzPLiBGg7GZEIXWOH9eHSqaPFcpU6WVVP", "a2tvmgP31UevP4cm4ALcthKXc8uyqPmQSBFHnlXe");
	//alert( "Parse has been initialized" );
};

mtmGufogiallo.data.login = function( username, password, callbackFunction ) {
	var UserObj = new Parse.User();
	var currentUser = null;
	var result = null;
	Parse.User.logIn( username, password, {	
		success: function( user ) {
			// The login succeeded
			//alert( "Login successful!" );
			currentUser = Parse.User.current();
			result = new Array();
			result[ 0 ] = currentUser.getUsername();
			result[ 1 ] = user.id;
			return callbackFunction( result );
		},
		error: function(user, error) {
			// The login failed
			//alert( "Login failed!" );
			if ( error.code === Parse.Error.OBJECT_NOT_FOUND ) {
				return callbackFunction( -1 );
			}
		}
	});
};

mtmGufogiallo.data.getTeamId = function( userId, callbackFunction ) {
	var UserObj = Parse.Object.extend( "User" );
	var query = new Parse.Query( UserObj );
	var myTeamId  = null;
	query.equalTo( "objectId", userId );
	query.first({
		success: function( user ) {
			myTeamId = user.get( "myteam" ).id;
			return callbackFunction( myTeamId );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
};

mtmGufogiallo.data.getTeamName = function( teamId, callbackFunction ) {
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var query = new Parse.Query( TeamObj );
	var myTeamName  = null;
	query.equalTo( "objectId", teamId );
	query.first({
		success: function( team ) {
			myTeamName = team.get( "name" );
			return callbackFunction( myTeamName );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
};

mtmGufogiallo.data.getTeamIdAndName= function( userId, callbackFunction ) {
	var UserObj = Parse.Object.extend( "User" );
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var userQuery = new Parse.Query( UserObj );
	var teamQuery = new Parse.Query( TeamObj );
	var myTeamId  = null;
	var myTeamName = null;
	var result = null;
	userQuery.equalTo( "objectId", userId );
	userQuery.first({
		success: function( user ) {
			myTeamId = user.get( "myteam" ).id;
			teamQuery.equalTo( "objectId", myTeamId );
			teamQuery.first({
				success: function( team ) {
					myTeamName = team.get( "name" );
					result = new Array();
					result[ 0 ] = myTeamId;
					result[ 1 ] = myTeamName;
					return callbackFunction( result );
				},
				error: function(error) {
					alert( "Error: " + error.code + " " + error.message );
				}
			});
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
};


mtmGufogiallo.data.getTeamPlayers = function( teamId, callbackFunction ) {
	var PlayerObj = Parse.Object.extend( "Player" );
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var query = new Parse.Query( PlayerObj );
	var innerQuery = new Parse.Query( TeamObj );
	
	innerQuery.equalTo( "objectId", teamId );
	query.matchesQuery( "team", innerQuery);
	query.equalTo( "is_deleted", 0 );
	query.select( "game_played", "goal_scored", "last_name", "name", "rating", "role" );
	
	query.ascending( "role", "last_name" );
	query.find({
		success: function( players ) {
			//console.log( "Players found: " + players );
			return callbackFunction( players );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
};

mtmGufogiallo.data.addPlayer = function( newPlayer, successCallbackFunction, failureCallbackFunction ) {
	var PlayerObj = Parse.Object.extend( "Player" );
	var player = new PlayerObj;
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var team = new TeamObj;
	team.id = newPlayer.teamId;
	
	
	player.set( "last_name", newPlayer.lastName );
	player.set( "name", newPlayer.firstName );
	player.set( "phone", newPlayer.phoneNumber );
	player.set( "email", newPlayer.emailAddress );
	player.set( "role", newPlayer.role );
	player.set( "shirt_number", newPlayer.shirtNumber );
	player.set( "birth_date", newPlayer.birthdateLong );
	player.set( "goal_scored", 0 );
	player.set( "game_played", 0 );
	player.set( "is_deleted", 0 );
	player.set( "event_presences", 0 );
	player.set( "events_total_number", 0 );
	player.set( "rating", 0 );
	player.set( "team", team );
	player.set( "in_current_season", true );
	player.setACL(new Parse.ACL(Parse.User.current()));

	player.save( null, {
		success: function( player ) {
			// Execute any logic that should take place after the object is saved.
			return successCallbackFunction( player.id );
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
};






