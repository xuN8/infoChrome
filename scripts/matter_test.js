function scl(factor) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    return factor * (w < h && w || h);
}

function storeLastPosition(self) {
    //console.log(self.positions);
    var motionTrailLength = 30; 
       
    // push an item
    self.positions.push({
        x: self.position.x,
        y: self.position.y
    });

    //get rid of first item
    if (self.positions.length > motionTrailLength) {
        self.positions.shift();
    }
} 

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse;
    Events = Matter.Events;

// create an engine
var engine = Engine.create();
var canvas = document.getElementById('canvas')

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    canvas: canvas,
    options: {
        width: scl(1),
        height: scl(1),
        wireframes: false,
        hasBounds: true,
        //showVelocity: true,
        background: 'rgba(0,0,0,0)',
        //showAngleIndicator: true,
    }
});

Matter.use('matter-attractors');

// scale canvas upon window resize
window.addEventListener("resize", function(){
    canvas.width = scl(1);
    canvas.height = scl(1);
    render.options.width = scl(1);
    render.options.height = scl(1);
});

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 1,
            render: {
                visible: false
            }
        }
    });
Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;

// create two boxes and a ground
MatterAttractors.Attractors.gravityConstant = 0.1;
var origin = Bodies.circle(scl(.5), scl(.5), scl(.1), {
    isStatic: true,
    collisionFilter: {
    'group': -1,
    'category': 2,
    'mask': 0,
    },  
    render: {
        fillStyle: 'rgba(0,0,0,0)',
    },
    
    plugin: {
        attractors: [
            //MatterAttractors.Attractors.gravity
          function(bodyA, bodyB) {
            // use Newton's law of gravitation
              var bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
                  distanceSq = Matter.Vector.magnitudeSquared(bToA),
                  normal = Matter.Vector.normalise(bToA),
                  //magnitude = -MatterAttractors.Attractors.gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
                  force = Matter.Vector.mult(normal, -0.1);

              // to apply forces to both bodies
              Matter.Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
              Matter.Body.applyForce(bodyB, bodyB.position, force);
            /*
            // snappy
            Matter.Body.applyForce(bodyB, bodyB.position, {
                x: ((bodyA.position.x - bodyB.position.x)*0.1) * 1e-2,
                y: ((bodyA.position.y - bodyB.position.y)*0.1) * 1e-2,
            });
            */
            /*
            // triangular
            Matter.Body.applyForce(bodyB, bodyB.position, {
                x: (bodyA.position.x - bodyB.position.x)**3 * 1e-8,
                y: (bodyA.position.y - bodyB.position.y)**3 * 1e-8,
            });
            */
            /*
            // basic
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-5,
              y: (bodyA.position.y - bodyB.position.y) * 1e-5,
            };
            */
          }
        ]
    }
});

var circleA = Bodies.circle(scl(.7), scl(.7), scl(.08), {
        frictionAir: 0.002, 
        //torque: 10, 
        restitution: 0, 
        positions: [],
        //force: {x: 0.1, y: 0}
        render: {
            fillStyle: 'cyan',
        },
        //mass: 15
    }, 
    5);

var circleB = Bodies.circle(scl(.2), scl(.4), scl(.08), {
        frictionAir: 0.002, 
        //torque: 10, 
        restitution: 0, 
        positions: [],
        //force: {x: -0.1, y: 0}
        render: {
            fillStyle: 'orange',
        },
    }, 
    5);

var bodies = [origin, circleA, circleB];

function drawStadium() {
    var stadiumThickness = scl(.04);
    var points = 50;
    var outerRadius = scl(.5);

    var innerRadius = outerRadius-stadiumThickness;
    var averageRadius = (outerRadius+innerRadius)/2;
    
    var d = (2*Math.PI)/points
    for (i=0; i<(2*Math.PI); i+=d) {
        if (i < Math.PI/3) {
            continue;
        }; 

        if (i > (2/3)*Math.PI && i < Math.PI) {
            continue;
        };

        if (i > (4/3)*Math.PI && i < (5/3)*Math.PI) {
            continue;
        };

        var bd = Bodies.fromVertices(
            ((averageRadius)*Math.cos(i)) + scl(.5),
            ((averageRadius)*Math.sin(i)) + scl(.5),
            [              
                {x: (outerRadius*Math.cos(i)) + scl(.5), y:(outerRadius*Math.sin(i)) + scl(.5)},
                {x: (outerRadius*Math.cos(i+d)) + scl(.5), y:(outerRadius*Math.sin(i+d)) + scl(.5)},

                {x: (innerRadius*Math.cos(i+d)) + scl(.5), y:(innerRadius*Math.sin(i+d)) + scl(.5)},
                {x: (innerRadius*Math.cos(i)) + scl(.5), y:(innerRadius*Math.sin(i)) + scl(.5)}             
            ],
            {isStatic: true,
                render: {
                    fillStyle: 'gray',
                },
            }
        )  
        Matter.Body.rotate(bd, -Math.PI/points);
        bodies.push(bd);
    };
};

engine.world.gravity.scale = 0;
//engine.timing.timeScale = 0.01;

drawStadium();

// add all of the bodies to the world
Composite.add(engine.world, bodies);

function drawTrails() {
    
    var ctx = render.context;   

    /*
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(scl(.5), scl(.5)); 
    ctx.lineTo(circleA.position.x, circleA.position.y);     
    ctx.stroke();
    var distanceFromCenter = Matter.Vector.magnitude(Matter.Vector.sub(circleA.position, Matter.Vector.create(scl(.5), scl(.5))));
    if (distanceFromCenter > scl(.5)) {
        console.log('OUT OF BOUNDS');
    }
    */

    var boundsWidth = render.bounds.max.x - render.bounds.min.x,
        boundsHeight = render.bounds.max.y - render.bounds.min.y,
        boundsScaleX = boundsWidth / render.options.width,
        boundsScaleY = boundsHeight / render.options.height;

    ctx.scale(1 / boundsScaleX, 1 / boundsScaleY);
    ctx.translate(-render.bounds.min.x, -render.bounds.min.y);

    var bodies = Composite.allBodies(engine.world); 
    
    for (var i = 0; i < bodies.length; i += 1) {
        // beyblade trails
        if (bodies[i].positions) {
            storeLastPosition(bodies[i]);
            for (var j = 0; j < bodies[i].positions.length; j++) {
                var ratio = (j + 1) / bodies[i].positions.length;

                ctx.lineCap = 'round';
                ctx.strokeStyle = bodies[i].render.fillStyle;
                ctx.lineWidth = 2*10*ratio;
                ctx.beginPath();

                if (j == 0) {
                    ctx.moveTo(bodies[i].positions[j].x, bodies[i].positions[j].y);
                } else {
                    ctx.moveTo(bodies[i].positions[j-1].x, bodies[i].positions[j-1].y);
                    ctx.lineTo(bodies[i].positions[j].x, bodies[i].positions[j].y);
                };

                ctx.stroke();
            }             
        }
    }
}



// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
Events.on(render, "beforeRenderBodies", drawTrails);
Events.on(runner, 'afterTick', function() {
    circleA.angle += .005;
    circleB.angle += .005;
});

Events.on(engine, "collisionStart", function() {
    //new Audio('sounds/hit.mp3').play();
    var ctx = render.context; 
    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min) ) + min;
    }
    var rx = randInt(-5, 6);
    var ry = randInt(-5, 6);
    translation.x = rx;
    translation.y = ry;

    setTimeout(() => {
        translation.x = 0;
        translation.y = 0;
    }, 100); 
});