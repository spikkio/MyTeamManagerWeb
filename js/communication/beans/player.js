var parseId, name, lastName, role, birthDate, email, phone, shirtNumber = 0, gamePlayed=0, goalScored=0, isDeleted=0, team, rating=0;

var idField = "id", nameField = "name", lastNameField = "last_name", roleIdField = "role", birthDateField = "birth_date", emailField = "email", phoneField = "phone",
shirtNumberField = "shirt_number", gamePlayedField="game_played", goalScoredField = "goal_scored", isDeletedField = "is_deleted", 
teamField = "team", ratingField = "rating";


function Player() {
	
	this.getParseObject = function() {
	    console.log("player lastname: " + this.lastName);
		var playerObj = Parse.Object.extend("Player");
		var playerParse = new playerObj();
	 
	 	playerParse.id = this.parseId;
	 	playerParse.set(nameField, this.getName());
	 	playerParse.set(lastNameField, this.getLastName());
	 	playerParse.set(roleIdField, this.getRole());
	 	playerParse.set(birthDateField, this.getBirthDate());
	 	playerParse.set(emailField, this.getEmail());
	 	playerParse.set(phoneField, this.getPhone());
	 	playerParse.set(shirtNumberField, this.getShirtNumber());
	 	playerParse.set(gamePlayedField, this.getGamePlayed());
	 	playerParse.set(goalScoredField, this.getGoalScored());
	 	playerParse.set(isDeletedField, this.getDeleted());
	 	
	 	if ( this.team !== undefined ) {
	 		playerParse.set(teamField, this.team.getParseObject());
	 	}
	 	
	 	playerParse.set(ratingField, this.getRating()); 
		
		return playerParse;
	}
	
	this.getPlayer = function(playerParseObject, index, callback) {
		var player = new Player();
		player.parseId = playerParseObject.id;
		player.name = playerParseObject.get(nameField);
		player.lastName = playerParseObject.get(lastNameField);
		player.role = playerParseObject.get(roleIdField);
		player.birthDate = playerParseObject.get(birthDateField);
		player.email = playerParseObject.get(emailField);
		player.phone = playerParseObject.get(phoneField);
		player.shirtNumber = playerParseObject.get(shirtNumberField);
		player.gamePlayed = playerParseObject.get(gamePlayedField);
		player.goalScored = playerParseObject.get(goalScoredField);
		player.isDeleted = playerParseObject.get(isDeletedField);
		player.rating = playerParseObject.get(ratingField);
		
		var retrievedTeam = playerParseObject.get(teamField);
		retrievedTeam.fetch({
  			success: function(team) {
  				var teamObj = new Team();
    			player.team = teamObj.getTeam(team);
    				callback(player, index);
  			}
  		});
		
	}
	
	this.getLastName = function() {
		if ( this.lastName == undefined ) {
			return "";
		}
		return this.lastName;
	}
	
	this.getName = function() {
		if ( this.name == undefined ) {
			return "";
		}
		return this.name;
	}
	
	this.getEmail = function() {
		if ( this.email == undefined ) {
			return "";
		}
		return this.email;
	}
	
	this.getPhone = function() {
		if ( this.phone == undefined ) {
			return "";
		}
		return this.phone;
	}
	
	this.getBirthDate = function() {
		if ( this.date == undefined ) 
			return 0;
		else 
			return this.date;
	}
	
	
	this.getRole = function() {
		if ( this.role == undefined ) 
			return 0;
		else 
			return this.role;
	}
	
	this.getShirtNumber = function() {
		if ( this.shirtNumber == undefined ) 
			return 0;
		else 
			return this.shirtNumber;
	}
	
	this.getGamePlayed = function() {
		if ( this.gamePlayed == undefined ) 
			return 0;
		else 
			return this.gamePlayed;
	}
	
	this.getGoalScored = function() {
		if ( this.goalScored == undefined ) 
			return 0;
		else 
			return this.goalScored;
	}
	
	this.getDeleted = function() {
		if ( this.isDeleted == undefined ) 
			return 0;
		else 
			return this.isDeleted;
	}
	
	this.getRating = function() {
		if ( this.rating == undefined ) 
			return 0;
		else 
			return this.rating;
	}
	
	this.getSurnameAndName = function() {
		var surnameAndName = this.lastName;
		if ( this.name != undefined ) {
			surnameAndName += " " + this.name;
		}
		return surnameAndName;
	}
}

