mtmGufogiallo.namespace("data");

mtmGufogiallo.data.init = function() {
	Parse.initialize("MXUjHyEvzPLiBGg7GZEIXWOH9eHSqaPFcpU6WVVP", "a2tvmgP31UevP4cm4ALcthKXc8uyqPmQSBFHnlXe");
	//alert( "Parse has been initialized" );
};

mtmGufogiallo.data.login = function( username, password, callbackFunction ) {
	var userObj = new Parse.User();
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
	var userObj = Parse.Object.extend( "User" );
	var query = new Parse.Query( userObj );
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
	var teamObj = Parse.Object.extend( "UserTeam" );
	var query = new Parse.Query( teamObj );
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
	var userObj = Parse.Object.extend( "User" );
	var teamObj = Parse.Object.extend( "UserTeam" );
	var userQuery = new Parse.Query( userObj );
	var teamQuery = new Parse.Query( teamObj );
	var myTeamId  = null;
	var myTeamName = null;
	var result = null;
	userQuery.equalTo( "objectId", userId );
	userQuery.first({
		success: function( user ) {
			myTeamId = user.get( "myteam" ).id;
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
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
};


mtmGufogiallo.data.getTeamPlayers = function( teamId, callbackFunction ) {
	var playerObj = Parse.Object.extend( "Player" );
	var teamObj = Parse.Object.extend( "UserTeam" );
	var query = new Parse.Query( playerObj );
	var innerQuery = new Parse.Query( teamObj );
	
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



/*
var mtmGufogialloData = {

	if ( Parse.User.current() ) {
		var teamId = "wCQnXiIe67"; //'Squadra A' team

		var TeamParseObj = Parse.Object.extend( "UserTeam" );
		var query = new Parse.Query( TeamParseObj );
		query.limit(10); // limit to at most 10 results

		query.equalTo( "objectId", teamId );
		query.find({
			success: function( results ) {
				alert( "Successfully retrieved " + results.length + " teams." );
			},
			error: function( error ) {
				alert( "Error: " + error.code + " " + error.message );
			}
		});

		var myTeam = new TeamParseObj;
		query.get( teamId, {
			success: function( myTeam ) {
				alert( "FOUND!" );
			},	
			error: function( myTeam, error ) {
				alert( "Error: " + error.code + " " + error.message );
			}
		});
	}
	
};
*/



