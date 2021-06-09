var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var motionTrailLength = 50;
var positions = [];

function drawStadium() {
	ctx.lineWidth = 1;
	ctx.beginPath();
	const radius = canvas.width/2;
	ctx.arc(radius, radius, radius, 0, Math.PI*2, false);
	ctx.fillStyle = "lightgray";
	ctx.fill();
	ctx.stroke();
}

function drawPlane() {
	ctx.lineWidth = 1;
	ctx.beginPath();

	// draw horizontal line from left to right
	ctx.moveTo(0, canvas.height/2);
	ctx.lineTo(canvas.width, canvas.height/2);

	// draw vertical line from top to bottom
	ctx.moveTo(canvas.width/2, 0);
	ctx.lineTo(canvas.width/2, canvas.height);

	ctx.strokeStyle = "black";
	ctx.stroke();
};

// functions for converting from standard coordinate plane to actual plane
function X(x) {
	realX = x + canvas.width/2;	
	return realX;
};

function Y(y) {
	realY = (-y) + canvas.height/2;
	return realY;
}

function storeLastPosition(xPos, yPos) {
  // push an item
  positions.push({
    x: xPos,
    y: yPos
  });
 
  //get rid of first item
  if (positions.length > motionTrailLength) {
    positions.shift();
  }
}

function animate() {
    requestAnimationFrame(animate);   
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawStadium();
	drawPlane();

	const beyRadius = 20;

	
	for (var i = 0; i < positions.length; i++) {
		var ratio = (i + 1) / positions.length;

		ctx.lineCap = 'round';
		ctx.strokeStyle = "gray";//"rgba(204, 102, 153, " + ratio / 2 + ")";
		ctx.lineWidth = 2*beyRadius*ratio;
		ctx.beginPath();

		if (i == 0) {
			ctx.moveTo(positions[i].x, positions[i].y);
		} else {
			ctx.moveTo(positions[i-1].x, positions[i-1].y);
			ctx.lineTo(positions[i].x, positions[i].y);
		};

		ctx.stroke();
		//ctx.beginPath();
	    //ctx.arc(positions[i].x, positions[i].y, beyRadius*ratio, 0, 2 * Math.PI, true);
	    //ctx.fillStyle = "rgba(204, 102, 153, " + ratio / 2 + ")";
	    //ctx.fill();
	    ctx.strokeStyle = "black";
	}
	
    
    const cos = Math.cos
   	const sin = Math.sin
   	const pi = Math.PI

    const secondsPerMilisecond = .001    
   	const sec = new Date().getTime() * secondsPerMilisecond;
   	const t = 2*pi*sec;		// 2pi makes it take two seconds for a full rotation

	

   	// adjustable by user
	const orbitRadius = document.getElementById('orbit-radius').value;
	const xSkew = document.getElementById('x-skew').value;
	const ySkew = document.getElementById('y-skew').value;
   	

    const x = orbitRadius * cos(xSkew*t);
  	const y = orbitRadius * sin(ySkew*t);

    ctx.beginPath();
	ctx.arc(X(x), Y(y), beyRadius, 0, Math.PI*2, false);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.stroke();

	storeLastPosition(X(x), Y(y));
}

canvas.width = window.innerWidth/2;
canvas.height = window.innerWidth/2;
canvas.style.backgroundColor = "white";
	
animate();