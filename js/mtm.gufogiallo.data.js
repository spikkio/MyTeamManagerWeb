mtmGufogiallo.namespace("data");

mtmGufogiallo.data.init = function() {
	Parse.initialize("MXUjHyEvzPLiBGg7GZEIXWOH9eHSqaPFcpU6WVVP", "a2tvmgP31UevP4cm4ALcthKXc8uyqPmQSBFHnlXe");
	//alert( "Parse has been initialized" );
};

mtmGufogiallo.data.login = function( username, password, callbackFunction ) {
	var user = new Parse.User();
	Parse.User.logIn( username, password, {	
		success: function(user) {
			// The login succeeded
			//alert( "Login successful!" );
			var currentUser = Parse.User.current();
			var result = new Array();
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

mtmGufogiallo.data.getTeam = function( userId, callbackFunction ) {
	var user = Parse.Object.extend( "User" );
	var query = new Parse.Query( user );
	query.equalTo( "objectId", userId );
	query.first({
		success: function( result ) {
			var myTeamId = result.get( "myteam" ).id;
			return callbackFunction( myTeamId );
		},
		error: function(error) {
			alert( "Error: " + error.code + " " + error.message );
		}
	});
	//var myTeamId = 
	//var myTeam = 
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



