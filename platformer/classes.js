function Tile(type,_x,_y,width,height) {
    this.type = type;
    this._x = _x;
    this._y = _y;
    this.width = width;
    this.height = height;
    this.count = globalCount;
    
    this.isDoor = function() {
        if('^v<>'.includes(this.type[1])) {
            return true;
        } else {
            return false;
        }
    };
    
    this.draw = function() {
        if(this.type == 'tile') {
            ctx.fillStyle = 'lightgray';
            ctx.fillRect(this._x,this._y,this.width+1,this.height+1);

        } else if(this.type == 'checkpoint') {
            ctx.fillStyle = green;
            ctx.fillRect(this._x,this._y,this.width+1,this.height+1);
            
        } else if(this.isDoor()) {
            function fillStyle(x1,y1,x2,y2) {
                var shade;
                shade = ctx.createLinearGradient(x1,y1,x2,y2);
                shade.addColorStop(0, black);
                shade.addColorStop(1,'transparent');
                ctx.fillStyle = shade;                          
            }
            //ctx.fillStyle = 'blue';
            //ctx.fillRect(this._x,this._y,this.width+1,this.height+1);
            ctx.save();
            switch(this.type[1]) {
            case '>':
                ctx.translate(-this.width,0);
                fillStyle(this._x+this.width,0,this._x,0);
                break;
            case '<':
                ctx.translate(this.width,0);
                fillStyle(this._x,0,this._x+this.width,0);
                break;
            case '^':
                ctx.translate(0,this.height);
                fillStyle(0,this._y,0,this._y+this.height);
                break;
            case 'v':
                ctx.translate(0,-this.height);
                fillStyle(0,this._y+this.height,0,this._y);
                break;
                    } 
            ctx.fillRect(this._x,this._y+1,this.width,this.height);
            ctx.restore();
            
        } else if(this.type == 'lava') {
            var amp = scale/2;  //amplitude of the wave
            var wave = Math.sin(this.count);
            ctx.fillStyle = lava;
            
            for(var i=1; i<2; i+=0.3) {
            ctx.fillRect(this._x,this._y - amp/i - (wave * amp/i),this.width, this.height + amp/i + (wave * amp/i));
            }
            
            ctx.fillStyle = 'transparent';
            this.count += 0.03;
            ctx.fillRect(this._x,this._y,this.width+1,this.height+1);
        }
    };
    
    this.isTouching = function() {
        var pR = plyr.x + plyr.width;
        var pL = plyr.x;
        var pT = plyr.y;
        var pB = plyr.bttm;
        var r = this._x + this.width;
        var l = this._x;
        var t = this._y;
        var b = this._y + this.height;
        //is the player's y intersecting with object?
        var inLine = pB > t && pT < b;
        //is player plyr.touching the left of object?
        var left = pL < r && pL > l;
        //is player plyr.touching the right?
        var right = pR > l && pR < r;
        //is the player's y intersecting with object?
        
        if(inLine && (left || right)) {
            if(this.type == 'spike' || this.type == 'lava') {
                death = true;
            } else if(this.type == 'checkpoint') {
                newCheckpoint = true;
            } else if(this.isDoor()) {
                //plyr.prevLevel = plyr.level;
                //plyr.level = this.type[0];
                //init();
                render = false;
                transitions(trigger=true,this.type[0]);
                init();
            }
        }
        return inLine && (left || right);
    };
    
    this.collisionTop = function() {
        var collisionTop = plyr.bttm >= this._y && plyr.bttm <= this._y + this.height;
        return collisionTop;
    };
    
    this.collisionBottom = function() {
        var collisionBottom = plyr.y <= this._y + this.height && plyr.y >= this._y;
        return collisionBottom;
    };
}
function Button(action,x,y,src) {
    this.r = btnRadius;
    this.x = x;
    this.y = y - this.r;
    this.color = "rgba(0,0,0,0.1)";
    this.icon = new Image();
    this.icon.src = src;
    this.action = action;
    
    this.processTouch = function() {
        this.color = "rgba(0,0,0,0.1)";
        var xRange;
        var yRange;
        for(var i=0; i < coordinates.x.length; i++) {
            xRange = coordinates.x[i] - this.x < this.r && coordinates.x[i] - this.x > -this.r;
            yRange = coordinates.y[i] - this.y < this.r && coordinates.y[i] - this.y > -this.r;   
                
            if(xRange && yRange) {
                this.color = "rgba(0,100,100,0.1)";
                if(this.action == 'jump' && (plyr.bttm == ground || plyr.touching === true)) {
                    plyr.jump = true;
                } else {
                    keys = '';
                    keys = this.action;
                }
            }
        }
    };
    
    this.processTouchEnd = function(TouchEndX, TouchEndY) {
        for(var i=0; i<TouchEndX.length; i++) {
            var xRange;
            var yRange;
            xRange = TouchEndX[i] - this.x < this.r && TouchEndX[i] - this.x > -this.r;
            yRange = TouchEndY[i] - this.y < this.r && TouchEndY[i] - this.y > -this.r;
            
            if(xRange && yRange) {
                if(this.action != 'jump') {
                    //console.log('it works!');
                    keys = '';
                }
            }
            this.color = "rgba(0,0,0,0.1)";
        }
        
    }
    
    this.draw = function() {
        if(isMobile === true) {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.drawImage(this.icon, this.x - this.r, this.y - this.r, this.r*2, this.r*2);
        }
    };
}