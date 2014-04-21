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


mtmGufogiallo.data.getTeam = function( teamId, successCallbackFunction, failureCallbackFunction ) {
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
						if ( !player.attributes.rating ) {
							player.attributes.rating = 0;
						}
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
	var playerQuery = new Parse.Query( PlayerObj );
	playerQuery.get ( playerId, {
		success: function( player ) {
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
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
};


mtmGufogiallo.data.deletePlayer = function( playerId, successCallbackFunction, failureCallbackFunction ) {
	var PlayerObj = Parse.Object.extend( "Player" );
	var playerQuery = new Parse.Query( PlayerObj );
	playerQuery.get ( playerId, {
		success: function( player ) {
			player.set( "is_deleted", 1 );
			player.save( null, {
				success: function( player ) {
					return successCallbackFunction( player.id );
				},
				error: function( error ) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and description.
					return failureCallbackFunction( error.code );
				}
			});
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
};


mtmGufogiallo.data.getTrainings = function( teamId, successCallbackFunction, failureCallbackFunction ) {
	var EventObj = Parse.Object.extend( "Event" );
	var eventQuery = new Parse.Query( EventObj );
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var teamQuery = new Parse.Query( TeamObj );
	var result = null;
	
	teamQuery.equalTo( "objectId", teamId );
	teamQuery.first({
		success: function( team ) {
			eventQuery.matchesQuery( "team", teamQuery);
			eventQuery.select( "location", "note", "repeat", "repeat_end_time", "timestamp" );
			eventQuery.ascending( "timestamp" );
			eventQuery.find({
				success: function( events ) {
					//console.log( "Events found: " + events );
					var eventsList = [];
					events.forEach( function( event ) {
						eventsList.push(
							{ 
								id: event.id,
								location: event.attributes.location,
								note: event.attributes.note,
								repeat: event.attributes.repeat,
								repeat_end_time: event.attributes.repeat_end_time,
								timestamp: event.attributes.timestamp
							}	
						);
					});
					return successCallbackFunction( eventsList );
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


mtmGufogiallo.data.addTraining = function( newTrainingsArray, teamId, successCallbackFunction, failureCallbackFunction ) {
	var EventObj = Parse.Object.extend( "Event" );
	var event = new EventObj;
	var parentEvent = new EventObj;
	var TeamObj = Parse.Object.extend( "UserTeam" );
	var team = new TeamObj;
	var eventIdArray = []; //this is the array of event IDs that will be returned as result of the function
	team.id = teamId;
	var childEventsArray = [];
	//save the parent event, which is stored in the first object contained in newTrainingsArray i.e. newTrainingsArray[0]
	event.set( "location", newTrainingsArray[0].location );
	event.set( "note", newTrainingsArray[0].note );
	event.set( "timestamp", newTrainingsArray[0].timestamp );
	event.set( "repeat", newTrainingsArray[0].recurrence );
	event.set( "repeat_end_time", newTrainingsArray[0].recurrenceExpireTimestamp );
	event.set( "parent_event", null ); //the parent event has no parent event 
	//event.set( "season", null );
	event.set( "team", team );
	event.set( "canceled", 0 ),
	event.setACL(new Parse.ACL(Parse.User.current()));

	event.save( null, {
		success: function( event ) {
			parentEvent = event;
			eventIdArray[0] = event.id; //push the parent event id into eventsIdArray
			//populate eventsArray with the other (children) events specified in newTrainingsArray, if any
			for ( var i = 1; i < newTrainingsArray.length; i++ ) {
				event = new EventObj;
				event.set( "location", newTrainingsArray[i].location );
				event.set( "note", newTrainingsArray[i].note );
				event.set( "timestamp", newTrainingsArray[i].timestamp );
				event.set( "repeat", 0 );
				event.set( "repeat_end_time", 0 );
				//event.set( "repeat", newTrainingsArray[i].recurrence ); //Not applied. By convention, child events have repeat set to 0
				//event.set( "repeat_end_time", newTrainingsArray[i].recurrenceExpireTimestamp ); //Not applied. By convention, child events have repeat_end_time set to 0
				event.set( "parent_event", parentEvent ); //link the child event to the parent event
				//event.set( "season", null );
				event.set( "team", team );
				event.set( "canceled", 0 ),
				event.setACL(new Parse.ACL(Parse.User.current()));
				childEventsArray.push( event );
			}	
			Parse.Object.saveAll( childEventsArray, {
				success: function( childEventsArray ) {
					for ( i = 0; i < childEventsArray.length; i++ ) { 
						eventIdArray.push( childEventsArray[i].id ); //push the ids of the children events into eventsIdArray
					}
					return successCallbackFunction( eventIdArray );
				},
				error: function( error ) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and description.
					return failureCallbackFunction( error.code );
				}
			});	
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
};


mtmGufogiallo.data.updateTraining = function( eventId, eventData, successCallbackFunction, failureCallbackFunction ) {
	var EventObj = Parse.Object.extend( "Event" );
	var eventQuery = new Parse.Query( EventObj );
	eventQuery.get ( eventId, {
		success: function( event ) {
			event.set( "location", eventData.location );
			event.set( "note", eventData.note );
			event.set( "timestamp", eventData.timestamp );	
			event.save( null, {
				success: function( event ) {
					// Execute any logic that should take place after the object is saved.
					return successCallbackFunction( event.id );
				},
				error: function( error ) {
					// Execute any logic that should take place if the save fails.
					// error is a Parse.Error with an error code and description.
					return failureCallbackFunction( error.code );
				}
			});
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
}

mtmGufogiallo.data.deleteTraining = function( eventId, isDeleteRelatedEventsRequest, successCallbackFunction, failureCallbackFunction ) {
	var EventObj = Parse.Object.extend( "Event" );
	var eventQuery = new Parse.Query( EventObj );
	var anotherEventQuery = new Parse.Query( EventObj );
	var eventsToBeDeleted = []; //it  is an array of events id
	var isParentEvent = null;
	eventQuery.get ( eventId, {
		success: function( event ) {
			isParentEvent = !(event.attributes.parent_event); //isParent is true if the 'parent_event' field is null 
			if ( isDeleteRelatedEventsRequest !== true ) {
				//delete just the indicated event, with no impacts on related events
				event.destroy( {
					success: function( event ) {
						eventsToBeDeleted.push( eventId );
						return successCallbackFunction( eventsToBeDeleted );
					},
					error: function( error ) {
						// Execute any logic that should take place if the save fails.
						// error is a Parse.Error with an error code and description.
						return failureCallbackFunction( error.code );
					}
				});
			} else {
				//delete all events sharing the same parent as the indicated event, including the parent event
				if ( isParentEvent ) {
					//the event is a parent event: find all children events, including the parent event itself
					anotherEventQuery.equalTo( "parent_event", event );
					anotherEventQuery.find( {
						success: function( results ) {
							//list of children events retrieved. Add the parent event to the list , then destroy the entire list
							results.push( event );
							Parse.Object.destroyAll (results, {
								success: function() {
									results.forEach( function( event ) {
										eventsToBeDeleted.push( event.id );
									});
									return successCallbackFunction( eventsToBeDeleted );
								},
								error: function(error) {
									failureCallbackFunction ( error.code );
								}
							});	
						},
						error:	function(error) {
							failureCallbackFunction ( error.code );
						}
					});
				} else {
					//the event is NOT a parent event: find all siblings events with the same parent and delete them, including the parent event itself
					anotherEventQuery.equalTo( "parent_event", event.attributes.parent_event );
					anotherEventQuery.find( {
						success: function( results ) {
							//list of sibling events retrieved. Add the parent event to the list , then destroy the entire list
							results.push( event.attributes.parent_event );
							Parse.Object.destroyAll (results, {
								success: function() {
									results.forEach( function( event ) {
										eventsToBeDeleted.push( event.id );
									});
									return successCallbackFunction( eventsToBeDeleted );
								},
								error: function(error) {
									failureCallbackFunction ( error.code );
								}
							});	
						},
						error:	function(error) {
							failureCallbackFunction ( error.code );
						}
					});
				}				

			}
		},
		error: function( error ) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and description.
			return failureCallbackFunction( error.code );
		}
	});
};



