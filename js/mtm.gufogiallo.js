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
			jQuery("#errorModal").i18n();
			
			var appName = t("app.name");
		});
		//Initialize data component
		mtmGufogiallo.data.init();
		//Initialize controller component
		mtmGufogiallo.controller.init();
		console.log( "ready!" );
	}
};
