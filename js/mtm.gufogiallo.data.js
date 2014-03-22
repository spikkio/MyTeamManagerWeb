mtmGufogiallo.namespace("data");

mtmGufogiallo.data.init = function() {
	Parse.initialize("MXUjHyEvzPLiBGg7GZEIXWOH9eHSqaPFcpU6WVVP", "a2tvmgP31UevP4cm4ALcthKXc8uyqPmQSBFHnlXe");
	//alert( "Parse has been initialized" );
};

mtmGufogiallo.data.login = function( username, password, successCallbackFunction, failureCallbackFunction ) {
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
			result[ 2 ] = user.get( "myteam" ).id;
			return successCallbackFunction( result );
		},
		error: function(user, error) {
			// The login failed
			//alert( "Login failed!" );
			if ( error.code === Parse.Error.OBJECT_NOT_FOUND ) {
				return failureCallbackFunction( error.code );
			}
		}
	});
};

/*
mtmGufogiallo.data.getTeamId = function( userId, successCallbackFunction, failureCallbackFunction ) {
	var UserObj = Parse.Object.extend( "User" );
	var query = new Parse.Query( UserObj );
	var myTeamId  = null;
	query.equalTo( "objectId", userId );
	query.first({
		success: function( user ) {
			myTeamId = user.get( "myteam" ).id;
			return successCallbackFunction( myTeamId );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
			return failureCallbackFunction( error.code );
		}
	});
};
*/


mtmGufogiallo.data.getTeam = mtmGufogiallo.data.getTeamName = function( teamId, successCallbackFunction, failureCallbackFunction ) {
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var teamQuery = new Parse.Query( TeamObj );
	var myTeamName  = null;
	var PlayerObj = Parse.Object.extend( "Player" );
	var playerQuery = new Parse.Query( PlayerObj );
	var innerTeamQuery = new Parse.Query( TeamObj );
	var result = null;
	
	teamQuery.equalTo( "objectId", teamId );
	teamQuery.first({
		success: function( team ) {
			myTeamName = team.get( "name" );
			
			innerTeamQuery.equalTo( "objectId", teamId );
			playerQuery.matchesQuery( "team", innerTeamQuery);
			playerQuery.equalTo( "is_deleted", 0 );
			playerQuery.select( "last_name", "name", "role", "shirt_number", "phone", "email", "rating", "game_played", "goal_scored", "birth_date" );
			playerQuery.ascending( "role", "last_name" );
			playerQuery.find({
				success: function( players ) {
					//console.log( "Players found: " + players );
					result = new Array();
					result[ 0 ] = myTeamName;
					//console.log(players);
					//map Parse objects to JS objects
					var playersList = [];
					players.forEach( function( player ) {
						playersList.push(
							{ 
								id: player.id,
								lastName: player.attributes.last_name,
								firstName: player.attributes.name,
								role: player.attributes.role,
								shirtNumber: player.attributes.shirt_number,
								phoneNumber: player.attributes.phone,
								emailAddress: player.attributes.email,
								rating: player.attributes.rating,
								gamesPlayed: player.attributes.game_played,
								goalsScored: player.attributes.goal_scored,
								birthDate: player.attributes.birth_date
							}	
						);
					});
					result[ 1 ] = playersList;
					return successCallbackFunction( result );
				},
				error: function(error) {
					alert( "Error: " + error.code + " " + error.message );
					return failureCallbackFunction( error.code );
				}
			});
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
			return failureCallbackFunction( error.code );
		}
	});
};

/*
mtmGufogiallo.data.getTeamName = function( teamId, successCallbackFunction, failureCallbackFunction ) {
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var query = new Parse.Query( TeamObj );
	var myTeamName  = null;
	
	query.equalTo( "objectId", teamId );
	query.first({
		success: function( team ) {
			myTeamName = team.get( "name" );
			return successCallbackFunction( myTeamName );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
			return failureCallbackFunction( error.code );
		}
	});
};
*/

/*
mtmGufogiallo.data.getTeamIdAndName= function( userId, successCallbackFunction, failureCallbackFunction ) {
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
					return successCallbackFunction( result );
				},
				error: function(error) {
					alert( "Error: " + error.code + " " + error.message );
					return failureCallbackFunction( error.code );
				}
			});
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
			return failureCallbackFunction( error.code );
		}
	});
};
*/

/*
mtmGufogiallo.data.getTeamPlayers = function( teamId, successCallbackFunction, failureCallbackFunction ) {
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
			return successCallbackFunction( players );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
			return failureCallbackFunction( error.code );
		}
	});
};
*/

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
	player.set( "goal_scored", newPlayer.goalsScored );
	player.set( "game_played", newPlayer.gamesPlayed );
	player.set( "is_deleted", 0 );
	player.set( "event_presences", newPlayer.eventPresencesNumber );
	player.set( "events_total_number", 0 );
	player.set( "rating", newPlayer.rating );
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


mtmGufogiallo.data.updatePlayer = function( playerId, playerData, successCallbackFunction, failureCallbackFunction ) {
	var PlayerObj = Parse.Object.extend( "Player" );
	var player = new PlayerObj;
	player.id = playerId;
	
	player.set( "last_name", playerData.lastName );
	player.set( "name", playerData.firstName );
	player.set( "phone", playerData.phoneNumber );
	player.set( "email", playerData.emailAddress );
	player.set( "role", playerData.role );
	player.set( "shirt_number", playerData.shirtNumber );
	player.set( "birth_date", playerData.birthdateLong );

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





