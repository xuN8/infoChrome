/*
important notes:
- y-axis is inverted
- Math.round is used for touching ground because of resizing issues
*/
//ESSENTIALS v
function setDefaults() {
    plyr.level = 0;
    plyr.prevLevel = 0;
}
function reset() {
    plyr.jump = false;   
    plyr.dy = 0;
    plyr.dx = 0;
    plyr.x = plyr.checkptX;
    plyr.y = plyr.checkptY;        //Old code: y(plyr.height / 2);
    plyr.number = [];   //tile that it is touching 
    plyr.bttm = Math.round(plyr.y + plyr.height);
    plyr.alpha = 1;
    plyr.color = 'rgba(102,178,178,'+ plyr.alpha.toString(10) +')';
}
function init() {
    resize();
    //check device type
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log('phone!');
        isMobile = true;
        //alert('phone!');
    }
    scale = canvas.width/20;
    //determine origin
    if(innerWidth > innerHeight) {
        ox = innerHeight/2;
        oy = innerHeight/2;
    } else {
        ox = innerWidth/2;
        oy = innerWidth/2;
    }
    
    maxDY = Math.round(canvas.width/40);  //terminal velocity
    maxDX = Math.round(canvas.width/100);
    console.log(maxDY);
    jumpHeight = canvas.width/55;
    gravity = canvas.width/800;
    ground = canvas.height;
    btnRadius = scale*2;
    
    plyr.width = scale*0.7;
    plyr.height = scale*0.7;
    processTilemap();
    reset();
    //mobile controls
    jumpBtn = new Button('jump',canvas.width - btnRadius - 10, canvas.height, 'https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-up-01-512.png');
    lBtn = new Button('l',btnRadius+10, canvas.height, 'https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-left-01-512.png');
    rBtn = new Button('r',lBtn.x+btnRadius*2+10, canvas.height, 'https://cdn3.iconfinder.com/data/icons/faticons/32/arrow-right-01-512.png');
    buttons = [jumpBtn, lBtn, rBtn];
}
function loop() {
    requestAnimationFrame(loop);
    if(render) {
        ctx.clearRect(-10,-10,innerWidth+10,innerHeight+10);
    }
    if(death) {
        update(0);
        gameOver();
    } else {
        update(1);
    }
    physics();
    update();
    controls();
    draw();
    transitions();
    var thisLoop = new Date();
    fps = 1000 / (thisLoop - lastLoop);
    lastLoop = thisLoop;
    //console.log(Math.round(thisLoop));
    //console.log('DY: '+plyr.dy);
}
function update(applyMovement = 0) {
    plyr.bttm = plyr.y + plyr.height;
    if(applyMovement == 1) {
        plyr.y += plyr.dy;
        plyr.x += plyr.dx;
    }
    function collisionCheck() {
        //solution 1: make global variables that detect collision
        //plyr.onTop = false;
        //plyr.onBttm = false;
        plyr.touching = false;
        //the for loop is unnecessary, but just keeping it in case I need it later
        plyr.number = [];
        for(var i = 0; i < tiles.length; i++) {
            if(tiles[i].isTouching() === true) {
                if(plyr.number.length < 1) {//new
                    plyr.touching = true;
                    plyr.number.push(i) /*OLD = i*/;
                }
            }
        /*
        if(tiles[i].collisionTop() === true) {
            plyr.onTop = true;
        }
        if(tiles[i].collisionBottom() === true) {
            plyr.onBttm = true;
        }
        */
        }
        //console.log(plyr.number);
    }
    collisionCheck();
}
function processTilemap() {
    tiles = [];
    spikes = [];
    var doorNum = 0;
    var seg;    //segments to help determine the parameters of special tiles
    for(var _y=0; _y<20; _y++) {
        for(var _x=0;_x<20;_x++) {
            var type = tilemap[plyr.level][_y][_x];

            switch(type) {
                case '0':
                    var tile = new Tile('tile',_x*scale,_y*scale,scale,scale);
                    tiles.push(tile);              
                    break;
                case 'd':
                    //stairs incline right
                    //start from top, get slimmer as you go, determine how far right you need to move
                    seg = scale / 3;
                    for(var i=0; i<3; i++) {
                        tiles.push(new Tile('tile',_x*scale + seg * (2-i), _y*scale + seg * i, scale - seg * (2-i), seg));
                    }                    
                    break;
                case 'a':
                    //stairs incline left
                    //start from the top, get slimmer as you go
                    seg = scale / 3;
                    for(var j=0; j<3; j++) {
                        tiles.push(new Tile('tile',_x*scale, _y*scale + (seg*j), scale - seg * (2-j), seg));
                    }                    
                    break;
                case '^':
                    //start from top, get slimmer as you go, determine how far right you need to move
                    seg = scale / 5;
                    
                    for(var k=0; k<5; k++) {
                        tiles.push(new Tile('spike',_x*scale + seg/2 * (5-k), _y*scale + seg * k, scale - seg * (5-k), seg));
                    }
                    spikes.push({
                        x:_x*scale,
                        y:_y*scale,
                        w:scale,
                        h:scale,
                        angle:0
                    });                    
                    break;
                case 'v':
                    //start from top, get thicker as you go, determine how far right you need to move
                    seg = scale / 5;
                    
                    for(var l=0; l<5; l++) {
                        tiles.push(new Tile('spike',_x*scale + seg/2 * (l+1), _y*scale + seg * l, scale - seg * (l+1), seg));
                    }
                    spikes.push({
                        x:_x*scale,
                        y:_y*scale,
                        w:scale,
                        h:scale,
                        angle:180
                    });                      
                    break;
                case '<':
                    //basically ^ except x and y are flipped
                    seg = scale / 5;
                    
                    for(var m=0; m<5; m++) {
                        tiles.push(new Tile('spike',_x*scale + seg * m, _y*scale + seg/2 * (5-m), seg, scale - seg * (5-m)));
                    }
                    spikes.push({
                        x:_x*scale,
                        y:_y*scale,
                        w:scale,
                        h:scale,
                        angle:270
                    });                    
                    break;
                case '>':
                    //basically ^ except x and y are flipped
                    seg = scale / 5;
                    
                    for(var n=0; n<5; n++) {
                        tiles.push(new Tile('spike',_x*scale + seg * n, _y*scale + seg/2 * (n+1), seg, scale - seg * (n+1)));
                    }
                    spikes.push({
                        x:_x*scale,
                        y:_y*scale,
                        w:scale,
                        h:scale,
                        angle:90
                    });                       
                    break;
                case '~':
                    tiles.push(new Tile('lava',_x*scale,_y*scale,scale,scale));
                    globalCount += 0.15;
                    break;
                case '*':
                    tiles.push(new Tile('checkpoint',_x*scale,_y*scale,scale,scale));                 
                    break;
                case '@':
                    //get the tilemap's info located in the last few items
                    var info = tilemap[plyr.level][20 + doorNum]
                    var doorName = 'door'+info;
                    //tiles.push(new Tile(doorName,_x*scale,_y*scale,scale,scale));
                    //face it in the proper direction
                    switch(info[1]) {
                        case '>':
                            tiles.push(new Tile(info, _x*scale+scale, _y*scale,scale/2,scale));
                            break;
                        case '<':
                            tiles.push(new Tile(info, (_x*scale-scale) + (scale/2), _y*scale,scale/2,scale));
                            break;
                        case '^':
                            tiles.push(new Tile(info, _x*scale, (_y*scale-scale) + (scale/2),scale,scale/2));
                            break;
                        case 'v':
                            tiles.push(new Tile(info, _x*scale, _y*scale+scale,scale,scale/2));
                            break;
                    }
                    if(info[0] == plyr.prevLevel) {
                        plyr.checkptX = _x*scale;
                        plyr.checkptY = _y*scale;
                        //plyr.x = _x*scale;
                        //plyr.y = _y*scale;
                    }
                    doorNum++;
                    break;
            }
        }    
    }
}
//ESSENTIALS ^

//CONTROLS v
function controls() {
    //keyboard controls
    function handleKey(name, action) {
        if(event.code == name) {
            keys = action;
        }
    }
    document.onkeydown = function() {
        event.preventDefault();
        if(event.code == 'KeyR') {
            reset();
        }
        //jump
        if((event.code == 'ArrowUp'||event.code == 'KeyW'||event.code == 'Space') && (plyr.bttm == ground || plyr.touching === true)) {
            plyr.jump = true;
        }
        //horizontal movement
        handleKey('ArrowRight','r');
        handleKey('ArrowLeft','l');
        handleKey('KeyD','r');
        handleKey('KeyA','l');
    };
    document.onkeyup = function() {
        event.preventDefault();
        if(event.code == 'ArrowRight'||event.code == 'ArrowLeft'||event.code == 'KeyA'||event.code == 'KeyD')
        keys = '';
    };
    
    function horizontalMovement(action, changeX) {
        if(keys == action) {
            //no other method works as well as this one, unfortunately
            var rate = changeX/2;
            if(Math.round(plyr.dx + rate) != (Math.abs(changeX)/changeX) * maxDX) {
                plyr.dx += rate;
            }
        }
    } 
    horizontalMovement('r',Math.round(scale/50));
    horizontalMovement('l',Math.round(-scale/50));  
}
//CONTROLS ^

//window resizing
function resize() {
    if(innerWidth > innerHeight) {
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
    }
}
window.addEventListener("resize", function() {
    resize();
    init();
});

touchControls();
setDefaults();
init();
loop();