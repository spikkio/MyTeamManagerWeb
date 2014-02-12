function loginListener() {
	this.consume = function(user) {
		alert("Login ok");
	}
	
	this.error = function(error) {
		alert("Login ko");
	}
}

