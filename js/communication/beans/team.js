var parseId, name, footballType;

var idField = "id", nameField = "name", footballTypeField="footballType";

function Team() {
	
	this.getParseObject = function() {
		var teamObj = Parse.Object.extend("UserTeam");
		var teamParse = new teamObj();
	 
	 	teamParse.id = this.parseId;
	 	teamParse.set(nameField, this.name);
	 	teamParse.set(footballTypeField, this.footballType);
	 	
	 	console.log("this.parseId: " + this.parseId);
	 	console.log("this.name: " + this.name);
	 	console.log("this.footballTypeField: " + this.footballTypeField);
		
		return teamParse;
	}
	
	this.getTeam = function(teamParseObject) {
		var team = new Team();
		team.parseId = teamParseObject.id;
		team.name = teamParseObject.get(nameField);
		team.footballType = teamParseObject.get(footballTypeField);
		return team;
	}
}

