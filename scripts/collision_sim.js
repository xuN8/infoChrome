const maxRadius = 80;
const minRadius = 30;

var colors = [
    "rgba(0,255,200,0.2)",
    "rgba(0,255,150,0.2)",
    "rgba(0,225,255,0.2)"
];

//select canvas
var canvas = document.querySelector('canvas');

//get context
var ctx = canvas.getContext('2d');

var mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', function(event) {
    //mouse cursor data
    //console.log(event);
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
    //expand canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    init();
});

function Circle(x,y,xvel,yvel,radius,color) {
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        //ctx.strokeStyle ="teal"
        //ctx.stroke();
        ctx.fillStyle = colors[color];
        ctx.fill();
    };
    
    this.update = function() {
        if(this.x > innerWidth - this.radius || this.x < 0 + this.radius) {
            this.xvel *= -1;
        }
        
        if(this.y > innerHeight - this.radius || this.y < 0 + this.radius) {
            this.yvel *= -1;
        }

        this.x += this.xvel;
        this.y += this.yvel;
        
        //mouse interaction
        var xRange = mouse.x - this.x < 50 && mouse.x - this.x > -50;
        var yRange = mouse.y - this.y < 50 && mouse.y - this.y > -50 ;   
        
        if(xRange && yRange && this.radius < maxRadius) {
            this.radius += 1;
        
        } else if(this.radius > minRadius) {
            this.radius -= 1;
        }
        
        this.draw();
    };
}      

var circles = [];

function init() { 
    circles = [];
    var area = innerWidth * innerHeight;
    var objNum = Math.floor(area/3000);
    
    for(var i = 0; i < objNum; i++) {
        var radius = 30;
        var x = Math.random() * (innerWidth - radius*2) + radius;
        var y = Math.random() * (innerHeight - radius*2) + radius;
        var xvel = (Math.random() - 0.5) * 2;
        var yvel = (Math.random() - 0.5) * 2;
        var randomColor = Math.floor(Math.random() * colors.length);
        circles.push(new Circle(x, y, xvel, yvel, radius, randomColor));
    }     
}

function animate() {
    requestAnimationFrame(animate);   
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for(var i = 0; i < circles.length; i++) {
        circles[i].update();
    }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
animate();
init();
/*
//ctx.fillRect(x, y, width, height);
ctx.fillStyle = "rgba(255,0,0,0.2)";
ctx.fillRect(0,0,100,100);
ctx.fillStyle = "rgba(0,255,0,0.2)";
ctx.fillRect(100,0,100,100);
ctx.fillStyle = "rgba(0,0,255,0.2)";
ctx.fillRect(200,0,100,100);

//line
ctx.beginPath();
ctx.moveTo(0,200);
ctx.lineTo(300,200);
ctx.strokeStyle = "rgba(0,100,0,1)";
ctx.stroke();

//arc
for(var i=0; i<50; i++) {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;
    var color = Math.random();
    
    if(color > 0.6) {
        ctx.strokeStyle ="blue";
    }else if (color > 0.3) {
        ctx.strokeStyle ="red";
    }else{
        ctx.strokeStyle ="green";
    };
    
    ctx.beginPath();
    ctx.arc(x,y,30,0,Math.PI*2,false);
    ctx.stroke();
};
*/
