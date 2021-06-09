function x(X) {
    var newX = ox + X;
    return newX;
}
function y(Y) {
    var newY = oy - Y;
    return newY;
}
function draw() {
    //draw xy planes
    function drawPlane() {
        ctx.beginPath();
        ctx.moveTo(0,y(0));
        ctx.lineTo(innerWidth,y(0));
        ctx.moveTo(x(0),0);
        ctx.lineTo(x(0),innerHeight);
        ctx.strokeStyle = "lightpink";
        ctx.stroke();
    }

    if(render) {
        //draw player
        ctx.fillStyle = plyr.color;
        ctx.fillRect(plyr.x,plyr.y,plyr.width,plyr.height);        
        //draw tiles
        for(var i = 0; i < tiles.length; i++) {
            tiles[i].draw();
        }
        //spikes
        for(var i = 0; i < spikes.length; i++) {
            ctx.save();
            ctx.translate(spikes[i].x + spikes[i].w/2, spikes[i].y + spikes[i].h/2);
            ctx.rotate(spikes[i].angle * Math.PI/180);
            ctx.beginPath();
    
            ctx.moveTo(-(spikes[i].w/2),spikes[i].h/2);
            ctx.lineTo(spikes[i].w/2,spikes[i].h/2);
            ctx.lineTo(0,-(spikes[i].h/2));
            ctx.lineTo(-(spikes[i].w/2),spikes[i].h/2);
            
            ctx.fillStyle = 'gray';
            ctx.fill();
            ctx.restore();
        }
    }
    //mobile controls
    for(var i=0;i<buttons.length;i++) {
        buttons[i].draw();
    }
}
function transitions(trigger=false,newLevel=0) {
    var alpha;
    if(trigger) {
        fadeToBlack = -fadeDuration;
        plyr.prevLevel = plyr.level;
        plyr.level = newLevel;
    } else if(fadeToBlack < fadeDuration) {
        fadeToBlack++;
        if(fadeToBlack == 0) {
            render = true
            init();
        }
        alpha = -1 * Math.abs(fadeToBlack/fadeDuration) + 1;
        ctx.fillStyle = 'rgba(54,58,61,'+ alpha +')';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}
function gameOver() {
    if(plyr.alpha <= 0) {
        death = false;
        reset();
    } else {
        plyr.alpha -= 0.05;
        plyr.color = 'rgba(102,178,178,'+ plyr.alpha.toString(10) +')';
    }
}