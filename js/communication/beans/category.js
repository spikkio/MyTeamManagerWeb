var parseId, categoryName;

var idField = "id", nameField = "name";

function category () {
	this.getParseObject = function() {
		var categoryObj = Parse.Object.extend("Category");
		var categoryParse = new categoryObj();
	 
	 	categoryParse.id = this.parseId;
	 	if ( this.categoryName !== undefined ) {
	 		categoryParse.set(this.nameField, this.categoryName);
	 	}
		
		
		
		return categoryParse;
	}
	
	this.getCategory = function(categoryParseObject) {
		var category = new Object();
		category.parseId = categoryParseObject.id;
		category.categoryName = categoryParseObject.get(nameField);
		return category;
	}
}


