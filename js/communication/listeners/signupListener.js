function signupListener() {
	this.consume = function(user) {
		alert("Signup ok");
	}
	
	this.error = function(error) {
		alert("Signup ko");
	}
}

