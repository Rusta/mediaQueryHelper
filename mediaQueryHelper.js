// create 'display dimensons object' in an attempt to not pollute the global namespace
var ddo = {};

// variables to capture dependent libraries status
ddo.jQuery = false;
ddo.jQueryLoading = false;
ddo.jQueryUILoading = false;
ddo.loadLibraryTimer;

// add jQuery library script tag to header
ddo.addJquery = function(){
		// set loading param so we do not add more than once
		ddo.jQueryLoading = true;
		var script   = document.createElement("script");
		script.type  = "text/javascript";
		script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js";     
		document.getElementsByTagName('head')[0].appendChild(script);
}; // end ddo.addJquery function

// add jQuery UI library script tag to header
ddo.addJqueryUI = function(){
		// set loading param so we do not add more than once
		ddo.jQueryUILoading = true;
	    var script   = document.createElement("script");
	    script.type  = "text/javascript";
	    script.src = "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js";     
	    document.getElementsByTagName('head')[0].appendChild(script);	
}; // end ddo.addJqueryUI function

// check if our dependent libraries are loaded and then initiate our code when they are available
// nb. this code polls for readiness of first jQuery and then jQuery UI (which has a dependency itself on jQuery) 
// and only initialises are main code when both external library methods exist
ddo.checkForLibraryReadiness = function(){	

	// if jQuery exists then set relevant param to true
	if (window.jQuery) { ddo.jQuery = true };

	// if jQuery doesn't exist and is not currently loading then add it
	if (!ddo.jQuery && !ddo.jQueryLoading)
	{
		// jQuery doesn't exist and is not already loading so we need to add it
		ddo.addJquery();
		// run this function again in half a second to check the status of library load
		clearInterval(ddo.loadLibraryTimer);
		ddo.loadLibraryTimer = setInterval( ddo.checkForLibraryReadiness, 500 );
	}

	// jQuery does exist so test for jQuery UI
	if (ddo.jQuery)
	{ 
		// if jQueryUI exists then set param to true and inialise the dimension display (finally)!
		if (window.jQuery.ui) { 
							ddo.jQueryUI = true; 
							ddo.initialiseDimensionsDisplay();
						};

		if(!ddo.jQueryUI && !ddo.jQueryUILoading)
		{
			// jQuery UI doesn't exist and is not already loading so we need to add it
			ddo.addJqueryUI();
			// run this function again in half a second to check the status of library load
			clearInterval(ddo.loadLibraryTimer);
			ddo.loadLibraryTimer = setInterval( ddo.checkForLibraryReadiness, 500 );		
		}

	}
}; // end ddo.checkForLibraryReadiness function

// get current page dimensions
ddo.getDimensions = function(){

	var windowWidth = 0;
	var windowHeight = 0;

	// different browsers show the width/height in different ways... the below should cover all of them 
	if( typeof( window.innerWidth ) == 'number' ) {
		// Modern Browsers
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		// IE
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		// ancient IE
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}

	// update our dimension display div with the captured dimensions
	$('#dimensionDisplayWidth').html(windowWidth);
	$('#dimensionDisplayHeight').html(windowHeight);

}; // ddo.getDimensions end function


// Add Dimension Display to page
ddo.initialiseDimensionsDisplay = function(){
	// we check for/add a class to the body to confirm to ensure we only add the dimension display div once
	if(!$('body').hasClass('dimensionDisplayAdded'))
	{
		$('body').addClass('dimensionDisplayAdded');

		// the html for our dimension display div
		var dimensionDisplayHTML = '<div id="dimensionDisplay">Width: <span id="dimensionDisplayWidth"></span><br>Height: <span id="dimensionDisplayHeight"></span></div>';
		// the CSS for our dimension display div
		var dimensionDisplayCSS = 	'<style> ' +
									'	#dimensionDisplay ' +
									'	{' +
									'		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; ' +
									'		position: fixed; ' +
									'		top: 5px; ' +
									'		left: 5px; ' +
									'		height: auto; ' +
									'		width: auto; ' +
									'		z-index: 999999; ' +
									'		background: rgb(54, 25, 25); ' +
									'		background: rgba(54, 25, 25, .4); ' +
									'		border-radius: 5px; ' +
									'		color: white; ' +
									'		padding: 5px; ' +
									'		cursor: move; ' +
									'		opacity:0; ' +									
									'		font-size: 80%; ' +
									'		-webkit-transition: background 1s ease; ' +
									'		transition: background 1s ease; ' +
									'		-webkit-transition: opacity 1s ease; ' +
									'		transition: opacity 1s ease; ' +
									'	}' +
									'	#dimensionDisplay:hover { ' +
									'		background: rgba(54, 25, 25, 0.7); ' +
									'	}' +
									'	#dimensionDisplay.fadeIn { ' +
									'		opacity: 1; ' +
									'	}' +									
									'</style>';

		// append the above HTML and CSS to the document body
		var div = document.createElement('div');
		div.innerHTML = dimensionDisplayHTML + dimensionDisplayCSS;
		document.body.appendChild(div);

		// call the getDimensions function
		ddo.getDimensions();

		// fade in the dimension display
		var dimensionDisplayDiv = document.getElementById('dimensionDisplay');
		setTimeout(function() {
    		dimensionDisplayDiv.classList.add("fadeIn");
		}, 500);

		// make the dimension display div draggable
		$('#dimensionDisplay').draggable();

		// Update Dimension Display upon resize of page
		$(window).resize(function() {
			ddo.getDimensions();
		});		
	}	
} // end ddo.initialiseDimensionsDisplay function

// get things started by check for Library Readiness
ddo.checkForLibraryReadiness();