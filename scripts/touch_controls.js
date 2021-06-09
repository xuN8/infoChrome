function touchControls() {
    //touch controls
    function getTouchPos(canvasDom, event) {
    	var rect = canvasDom.getBoundingClientRect();
    	var touchX = [];
    	var touchY = [];
        for(var i=0; i < event.touches.length; i++) {
            //console.log(event.touches[i]);
            touchX.push(event.touches[i].clientX - rect.left);
            touchY.push(event.touches[i].clientY - rect.top);
        }
    
    	return {
    		x: touchX,
    		y: touchY
    	};
    }
    canvas.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {//debug code
			e.preventDefault();
		}
    	coordinates = getTouchPos(canvas, e);
    	for(var i=0;i<buttons.length;i++) {
            buttons[i].processTouch();
        }
    }, false);
    canvas.addEventListener("touchend", function (e) {
        if (e.target == canvas) {//debug code
			e.preventDefault();
		}
        var endX = [];
        var endY = [];
        for(var j=0; j<e.changedTouches.length; j++) {
            endX.push(e.changedTouches[j].clientX);
            endY.push(e.changedTouches[j].clientY); 
        }
        
        for(var i=0;i<buttons.length;i++) {
            buttons[i].processTouchEnd(endX, endY);
        }
        //keys = '';
    }, false);
	// Prevent scrolling when touching the canvas
	canvas.addEventListener("touchmove", function (e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	}, false);
}