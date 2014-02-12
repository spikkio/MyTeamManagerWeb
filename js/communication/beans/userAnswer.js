var parseId, answer, question, time, score, user;

var answerField="answer", questionField="question", timeField="time", scoreField="score", userField = "user";

function userAnswer() {
	
	this.getParseObject = function() {
		var answerObj = Parse.Object.extend("UserAnswer");
		var answerParse = new answerObj();
	 
	 	answerParse.id = this.parseId;
	 	answerParse.set(answerField, this.answer.getParseObject());
	 	answerParse.set(questionField, this.question.getParseObject());
	 	answerParse.set(timeField, this.time);
	 	answerParse.set(scoreField, this.score);
		answerParse.set(userField, this.user);
		return answerParse;
	}
	
	this.getUserAnswer = function(answerParseObject, answerObj, questionObj, callback) {
		var userAnswer = new Object();
		userAnswer.parseId = answerParseObject.id;
		
		userAnswer.time = answerParseObject.get(timeField);
		userAnswer.score = answerParseObject.get(scoreField);
		
		var numberOfObjectToFetch = 2;
		var numberOfObjectFetched = 0;
		
		var retrievedAnswer = answerParseObject.get(answerField);
		retrievedAnswer.fetch({
  			success: function(ans) {
    			userAnswer.answer = answerObj.getAnswer(ans);
    			numberOfObjectFetched++;
    			if ( numberOfObjectFetched == numberOfObjectToFetch ) {
    				callback(userAnswer);
    			}
  			}
  		});
  		
  		var retrievedQuestion = answerParseObject.get(questionField);
		retrievedQuestion.fetch({
  			success: function(quest) {
    			userAnswer.answer = questionObj.getAnswer(quest);
    			numberOfObjectFetched++;
    			if ( numberOfObjectFetched == numberOfObjectToFetch ) {
    				callback(userAnswer);
    			}
  			}
  		});
		
	}
}


