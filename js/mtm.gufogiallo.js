/**
 * mtmGufogiallo
 *
 * @namespace
 */
var mtmGufogiallo = {

	currentUser: null,
	
	//Namespace handling function
    namespace: function( ns ) {
        var parts = ns.split( "." ),
            object = this,
            i, len;
        for ( i=0, len=parts.length; i < len; i++ ) {
            if ( !object[ parts[i] ] ) {
                object[ parts[ i ] ] = {};
            }
            object = object[ parts[ i ] ];
        }
        return object;
    },
	
	
	//initialization
	/**
	 * Initialize the entire app
	 * 
	 * @function 
	 */
	init: function() {
	
		//Localization via i18n
		i18n.init( function(t) {
			// translate UI components
			jQuery("#loginDiv").i18n();
			jQuery("#headerDiv").i18n();
			jQuery("#navDiv").i18n();
			jQuery("#loadingModal").i18n();
			jQuery("#infoModal").i18n();
			jQuery("#confirmModal").i18n();
			
			var appName = t("app.name");
		});
		//Initialize data component
		mtmGufogiallo.data.init();
		//Initialize controller component
		mtmGufogiallo.controller.init();
		console.log( "ready!" );
	},
	
	//Helper functions
	
	/**
	 * Serialize a date into a long
	 * 
	 * @function
	 * @param day: the day in the date
	 * @param month: the month in the date
	 * @param year: the year in the date
	 * @returns a number, corresponding to the number of milliseconds between midnight of January 1, 1970 and the specified date
	 */
	serializeDate: function ( day, month, year ) {
		return new Date( year, month, day, 0, 0, 0, 0).getTime();
	},
	
	/**
	 * Unserialize a long into an array of date components (day, month, year)
	 * 
	 * @function
	 * @param dateLong: a number, corresponding to the number of milliseconds between midnight of January 1, 1970 and the specified date
	 * @returns an array where the first element is the day, the second element is the month and the third element is the year of the specified date
	 */
	unserializeDate: function ( dateLong ) {
		var date = new Date( dateLong );
		var dateArray = [];
		dateArray[0] = date.getDate(); //day
		dateArray[1] = date.getMonth(); //month
		dateArray[2] = date.getFullYear(); //year
		return dateArray;
	}	
};


// Validator: validates that a given date is greater (later) than another one 
jQuery.formUtils.addValidator({
  name : 'laterDate',
  validatorFunction : function(value, $el, config, language, $form) {
	var startTrainingDateString = $form.find("#trainingDate").val();
	var startTrainingTimestampLong = new Date( startTrainingDateString.split("/")[2], startTrainingDateString.split("/")[1] -1 , startTrainingDateString.split("/")[0], 0, 0, 0, 0).getTime();
	var endTrainingDateString = $form.find("#trainingRecurrenceExpireDate").val();
	var endTrainingTimestampLong = new Date( endTrainingDateString.split("/")[2], endTrainingDateString.split("/")[1] -1 , endTrainingDateString.split("/")[0], 0, 0, 0, 0).getTime();
	//console.log("START:" + startTrainingTimestampLong);
	//console.log("END:" + endTrainingTimestampLong);
    return endTrainingTimestampLong > startTrainingTimestampLong;
  },
  errorMessage : 'You have to give a date which is later than the start date',
  errorMessageKey: 'badLaterDate'
});