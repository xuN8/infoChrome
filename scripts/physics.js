function physics() {
    update();
    if(plyr.jump === true) {
        plyr.dy = -jumpHeight;
        jumpSound.play();
        plyr.jump = false;
    }
    //GRAVITY
    /*
    if touching ground or object:
    stop vertical movement and reposition to surface
    */
    if(plyr.bttm > ground) {
        plyr.dy = 0;
        while(plyr.bttm > ground) {
            plyr.y -= 1;
            update();
        }
    } else if(plyr.bttm < ground && plyr.touching === false) {
        /*
        else if not touching anything and velocity is less than the maximum:
        continue accelerating
        */
        plyr.dy += gravity;
        if(Math.abs(plyr.dy) > maxDY) {
            plyr.dy -= gravity;
        }
    } 
    
    //FRICTION
    //applies if LR keys released and the player is either on the ground or a platform:
    if(keys == '' && (plyr.bttm == ground || plyr.touching === true)) {
        plyr.dx *= 0.7;
    }
    
    //WALLS
    //if touching the right or left wall, reposition and ricochet off
    if(plyr.x > canvas.width - plyr.width || plyr.x < 0) {
        while(plyr.x > canvas.width - plyr.width || plyr.x < 0) {
            plyr.x -= plyr.dx/Math.abs(plyr.dx);
        }
        plyr.dx *= -0.9;
    }
    //if touching top, reposition and stop going up
    //no checks for ground because it's already in the gravity script
    if(plyr.y < 0) {
        while(plyr.y < 0) {
            plyr.y ++;
        }  
        plyr.dy = 0;
    }
    
    //COLLISION
    function collision(changeY){
        update();
        //determine steepness of the incline(slope)
        //if slope is too steep, undo vertical movement and change horizontal movement instead
        //otherwise, leave the vertical movment as is
        //the 'return' part is just so that it can deal with y velocity correctly
        var slope = 0;
        //var max = 25;
        while(plyr.touching === true && slope < maxDY) {
            plyr.y += changeY;
            slope ++;
            update();
        }
        //console.log('Slope: '+slope);
        if(slope == maxDY) {
            plyr.y -= slope * changeY;
            slope = 0;
            while(plyr.touching === true && slope < maxDY/2) {
                plyr.x += Math.abs(plyr.dx)/plyr.dx * -1;
                update();
                slope ++;
            }
            
            plyr.dx *= -0.8;
            return plyr.dy;
            
        } else {
            return 0;
        }
    }
    
    if(plyr.touching === true) {
        //this first "if" statment prevents instant max speed when player leaves platform
        if(plyr.dy > 0) {
            plyr.dy = 0;
        } 
        //change y either positively or negatively depending on position
        //the for loop is unnecessary, but just keeping it in case I need it later
        var onTop = false;
        for(var i=0;i<plyr.number.length;i++) {
           
            if(tiles[plyr.number[i]].collisionBottom() === false/*true*/) {
                onTop = true;
            }
            update();
        }
        //new code; used to be within for loop, but now onTop is priority
        if(onTop === false) {
            plyr.dy = collision(1);
        } else {
            collision(-1); 
            plyr.y ++;
        }

    }
    if(newCheckpoint) {
        plyr.checkptX = Math.round(plyr.x);
        plyr.checkptY = Math.round(plyr.y);
        //console.log(plyr.checkptX +', '+plyr.checkptY);
        newCheckpoint = false;
    }
}