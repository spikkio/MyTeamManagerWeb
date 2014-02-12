function userScoreListListener() {
	this.consume = function(scoreList) {
			if ( scoreList !== undefined ) {
				var text = "";
				for (var i = 0; i < scoreList.scores.length; i++) { 
					text += scoreList.scores[i].username + "        " + scoreList.scores[i].score + "\n";
				}
				
				alert(text);
			}

		
	}
	
	this.error = function(error) {
		alert("Retrieveing user score list was not possible");
	}
}