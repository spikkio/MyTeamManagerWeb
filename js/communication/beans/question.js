var text, answers, difficulty, category, parseId, rightAnswer;

var idField = "id", textField = "text", answersField = "answers", difficultyField = "difficulty", categoryField = "category", rightAnswerField = "rightAnswer";

function question() {
	 this.getParseObject = function() {
		var questionObj = Parse.Object.extend("Question");
		var questionParse = new questionObj();
	 
	 	questionParse.id = this.parseId;
	 	if ( this.text !== undefined ) {
	 		questionParse.set(textField, this.text);
	 	}
		
		if ( answers !== undefined ) {
			for (var i = 0; i < this.answers.length; i++) {
				questionParse.addUnique(answersField, this.answers[i].getParseObject());
			}
		}

		
		if ( this.difficulty !== undefined ) {
			questionParse.set(difficultyField, this.difficulty);
		}
		
		if ( this.category !== undefined ) {
			questionParse.set(categoryField, this.category.getParseObject());
		}
		
		if ( this.rightAnswer !== undefined ) {
			questionParse.set(rightAnswerField, this.rightAnswer.getParseObject());
		}
		
		return questionParse;
	}
	
	this.getQuestion = function(questionParseObject, index, rightAnswer, category, answer, callback) {
		var question = new Object();
		question.parseId = questionParseObject.get(idField);
		question.text = questionParseObject.get(textField);
		question.difficulty = questionParseObject.get(difficultyField);
		
		
		question.answers = questionParseObject.get(answersField);
		
		var numberOfObjectToFetch = 3;
		var numberOfObjectFetched = 0;
		
		var retrievedRightAnswer = questionParseObject.get(rightAnswerField);
		retrievedRightAnswer.fetch({
  			success: function(rightAnswerRetrieved) {
    			question.rightAnswer = rightAnswer.getAnswer(rightAnswerRetrieved);
    			console.log("right answer text: " + question.rightAnswer.text);
    			numberOfObjectFetched++;
    			if ( numberOfObjectFetched == numberOfObjectToFetch ) {
    				callback(question, index);
    			}
  			}
  		});
  		
		var retrievedCategory = questionParseObject.get(categoryField);
		retrievedCategory.fetch({
  			success: function(categoryObj) {
  				question.category = category.getCategory(categoryObj);
    			console.log("category: " + question.category.categoryName);
    			numberOfObjectFetched++;
    			if ( numberOfObjectFetched == numberOfObjectToFetch ) {
    				callback(question, index);
    			}
  			}
  		});  		
		
		var retrievedAnswers = questionParseObject.get(answersField);
		var answerArray = new Array();
		
		var i = 0;
		var objectRetrieved = 0;
		var objectToRetrieve = retrievedAnswers.length;
		
  			(function loop() {
				if (i < objectToRetrieve) {
   					retrievedAnswers[i].fetch({
		  				success: function(answersObj) {
							answerArray.push(answer.getAnswer(answersObj));
							objectRetrieved++;
							
							if ( objectRetrieved == objectToRetrieve ) {
							
								numberOfObjectFetched++;
								question.answers = answerArray;
								
								console.log("answerArray length: " + answerArray.length);
								if ( numberOfObjectFetched == numberOfObjectToFetch ) {
    								callback(question, index);
    							}
							}
  						}
  					});  
    				i++;
        			loop();
        		}
			}());
	}
	
		

}

