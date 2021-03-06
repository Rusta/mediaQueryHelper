// create 'display dimensons object' in an attempt to not pollute the global namespace
var ddo = {};

// get current page dimensions
ddo.getDimensions = function(){

	var windowWidth = 0;
	var windowHeight = 0;

	if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		// Modern Browsers
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		// Older Browsers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}

	// update our dimension display div with the captured dimensions
	document.getElementById('dimensionDisplayWidth').innerHTML=windowWidth;
	document.getElementById('dimensionDisplayHeight').innerHTML=windowHeight;
}; // getDimensions end function

// Add Dimension Display to page
ddo.initialiseDimensionsDisplay = function(){

	// we check for/add a class to the body to confirm to ensure we only add the dimension display div once
	if( !document.body.classList.contains('dimensionDisplayAdded') )
	{
		document.body.classList.add('dimensionDisplayAdded')

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
									'		-webkit-transition: background 1s ease, opacity 1s ease; ' +
									'		transition: background 1s ease, opacity 1s ease; ' +
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


		// make the dimension display div draggable for MOUSE and TOUCH events

		// add mousedown event listener on our div
		dimensionDisplayDiv.addEventListener('mousedown', ddo.mousedown, false);
		// call mouseup event listener (on window)
		window.addEventListener('mouseup', ddo.mouseup, false);

		/* COMMENT OUT TOUCH EVENTS 
		// add touchstart event listener on our div
		dimensionDisplayDiv.addEventListener('touchstart', ddo.touchstart, false);
		// call touchend event listener (on window)
		window.addEventListener('touchend', ddo.touchend, false);
		*/
		
		// Update Dimension Display upon resize of page
		window.onresize = function(event) {
		    ddo.getDimensions();
		}
	}	
} // end initialiseDimensionsDisplay function

ddo.mousedown = function(e){ 
	// set action type
	ddo.actionType = 'mouse';
	// add mousemove event listener to capture movement
	window.addEventListener('mousemove', ddo.dragDiv, true);
	// prevent default event in order to disable page text selection when dragging
	e.preventDefault();
	// capture our initial mouse position on mousedown
	ddo.dragStartX = e.clientX;
	ddo.dragStartY = e.clientY;
	// capture our initial div position on mousedown (to apply relative dragging offset)
	ddo.divStartX = ddo.getOffset( document.getElementById('dimensionDisplay') ).left;
	ddo.divStartY = ddo.getOffset( document.getElementById('dimensionDisplay') ).top;	
}; // end mousedown function

ddo.touchstart = function(e){ 
	// set action type
	ddo.actionType = 'touch';	
	// add touchmove event listener to capture movement
	window.addEventListener('touchmove', ddo.dragDiv, true);
	// prevent default event in order to disable page text selection when dragging	
	e.preventDefault();
	// capture our initial touch position on touchstart
	ddo.dragStartX = e.touches[0].pageX;
	ddo.dragStartY = e.touches[0].pageY;
	// capture our initial div position on touchstart (to apply relative dragging offset)
	ddo.divStartX = ddo.getOffset( document.getElementById('dimensionDisplay') ).left;
	ddo.divStartY = ddo.getOffset( document.getElementById('dimensionDisplay') ).top;	
}; // end touchstart function

ddo.mouseup = function(e){ 
	// remove mousemove listener from the window object
	window.removeEventListener('mousemove', ddo.dragDiv, true);
	e.preventDefault();
}; // end mouseup function

ddo.touchend = function(e){ 
	// remove touchmove listener from the window object
	window.removeEventListener('touchmove', ddo.dragDiv, true);
	e.preventDefault();
}; // end mouseup function

ddo.dragDiv = function(e, type){ 
	// subtract the difference between drag start position and current mouse/touch position from our div position
	// based on either mouse OR touch-end position
	if ( ddo.actionType == 'mouse')
	{
		var divDragX = ddo.divStartX - (ddo.dragStartX - e.clientX);
		var divDragY = ddo.divStartY - (ddo.dragStartY - e.clientY);	
	}
	else
	{
		var divDragX = ddo.divStartX - (ddo.dragStartX - e.touches[0].pageX);
		var divDragY = ddo.divStartY - (ddo.dragStartY - e.touches[0].pageY);			
	}
	// apply the new position coordinates to our div
	var div = document.getElementById('dimensionDisplay');
	div.style.left = divDragX  + 'px';
  	div.style.top = divDragY + 'px';	
}; // end dragDiv function

// generic function for getting an elements top and left offset coordinates
ddo.getOffset = function( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
} // end getOffset function

// get the ball rolling
ddo.initialiseDimensionsDisplay();



