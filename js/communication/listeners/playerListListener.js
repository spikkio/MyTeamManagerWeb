function playerListListener() {

	this.consume = function(players) {
		var text = "Number of players retrieved: " + players.length + "\n";
		for ( var i = 0; i < players.length; i++ ) {
			text += "Player name: " + players[i].getSurnameAndName()  + "\n";
		}
		console.log(text);
	}
	
	this.error = function(error) {
		alert("Retrieve players ko");
	}
}
