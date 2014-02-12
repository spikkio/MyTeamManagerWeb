var player, score, parseId;

var idField = "id", playerField = "player", scoreField = "score";

function userScore(){
	this.getParseObject = function() {
		var userScoreObj = Parse.Object.extend("UserScore");
		var userScoreParse = new userScoreObj();
	 
	 	userScoreParse.id = this.parseId;
		userScoreParse.set(this.playerField, this.userId);
		userScoreParse.set(this.scoreField, this.score);
		
		return userScore;
	}
	
	this.getUserScore = function(userScoreParseObject) {
		var userScore = new Object();
		userScore.parseId = userScoreParseObject.id;
		userScore.userId = userScoreParseObject.get(playerField);
		userScore.score = userScoreParseObject.get(scoreField);
		return userScore;
	}
}


