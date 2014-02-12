var questionParseName = "Question", userScoreParseName="UserScore";

function parseManager() {

	this.signup = function(signupListener, email, password) {
		console.log("start signup");
		var user = new Parse.User();
		user.set("username", email);
		user.set("password", password);
		user.set("email", email);
		 
		user.signUp(null, {
		  success: function(user) {
		    signupListener.consume(user);
		  },
		  error: function(user, error) {
		    signupListener.error(user, error);
		  }
		});
	}
	
	this.forgottenPassword = function(forgottenPasswordListener, email) {
		Parse.User.requestPasswordReset(email, {
	  		success: function() {
	    		forgottenPasswordListener.consume();
	  		},
	  		error: function(error) {
	   			forgottenPasswordListener.error(error);
	  		}
		});
	}
	
	
	this.login = function (loginListener, email, password) {
	   Parse.User.logIn(email, password, {
	     success: function(user) {
	         loginListener.consume(user);
	     },
	     error: function(user, error) {
	        loginListener.error(user, error);
	      }
	   });
	}
	
	this.getPlayers = function(playerListConsumer) {
		
		var player = Parse.Object.extend("Player");
		var query = new Parse.Query(player);
		var notifiedCompleted = 0;
		
		
		query.find({
	  		success: function(results) {
	  			var players = new Array();
	  			
	  			var playerObj = new Player();
	  			
	  			var i = 0;
	  			(function loop() {
    				if (i < results.length) {	
       						playerObj.getPlayer(results[i], i, function(obj, index) {
       							notifiedCompleted++;
								players[index] = obj;
								console.log("notifiedCompleted: " + notifiedCompleted);
								if ( notifiedCompleted == results.length ) {
									playerListConsumer.consume(players);
								}
        					});
        					i++;
            				loop();
            		}
    			}());
	    		
	  		},
	  		error: function(error) {
	    		playerListConsumer.error(error);
	  		}
		});
	}
	
	this.addPlayer = function(player, addPlayerListener) {
		player.getParseObject().save(null, {
		  success: function(addedPlayer) {
		    alert('New object created with objectId: ' + addedPlayer.id);
		  },
		  error: function(addedPlayer, error) {
		    alert('Failed to create new object, with error code: ' + error.description);
		  }
		});
	}
	
	this.deletePlayer = function(player) {
		player.getParseObject().destroy({
		  success: function(myObject) {
		     alert('Deleted object with objectId: ' + myObject.id);
		  },
		  error: function(myObject, error) {
		    // The delete failed.
		     alert('Failed to delete the object with id: ' + myObject.id);
		  }
		});
	}

	
}

