var text, parseId;

var idField = "id", textField = "text";

function answer() {
	
	this.getParseObject = function() {
		var answerObj = Parse.Object.extend("Answer");
		var answerParse = new answerObj();
	 
	 	answerParse.id = this.parseId;
	 	if ( this.text !== undefined ) {
	 		answerParse.set(this.textField, this.text);
		
			console.log("Text of answer: " + this.text);
	 	}
		
		return answerParse;
	}
	
	this.getAnswer = function(answerParseObject) {
		var answer = new Object();
		answer.parseId = answerParseObject.id;
		answer.text = answerParseObject.get(textField);
		return answer;
	}
}

