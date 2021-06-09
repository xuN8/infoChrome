Physics(function (world) {

    // add the renderer
    world.add(renderer);

    // render on each step
    world.on('step', onStep);

    // If you want to subscribe to collision pairs
    // emit an event for each collision pair
    world.on('collisions:detected', onCollision); 

    // resize events
    window.addEventListener('resize', function () {
        // as of 0.7.0 the renderer will auto resize... so we just take the values from the renderer
        viewportBounds = Physics.aabb(0, 0, renderer.width, renderer.height);
        // update the boundaries
        edgeBounce.setAABB(viewportBounds);
        // update gravity position
        gravity.position(Physics.vector(window.innerWidth/2, window.innerHeight/2));

        if (stadium) {
            //drawStadium();
            stadium.state.pos = Physics.vector(window.innerWidth/2, window.innerHeight/2);
        };
    }, true);


    class Beyblade {
        constructor(color) {
            this.color = color;
            var body = Physics.body('convex-polygon', {
                x: randInt(renderer.width*0.4,renderer.width*0.7)
                ,y: randInt(renderer.height*0.7,renderer.height*0.7)
                ,vx: 0.3
                ,restitution: 0.9
                ,styles: {
                    fillStyle: this.color//colors[i]
                    //,angleIndicator: '#72240d'
                }    
                ,vertices: Physics.geometry.regularPolygonVertices(5, scale(.06))
                , positions: [] 
                //,mass: 10  
                ,cof: 100   
            });

            bodies.push(body);
            world.add(body);
            layer.addToStack(body)
        };
    };

    new Beyblade('cyan');
    //new Beyblade('orange');

    /*
    var colors = ['cyan', 'orange'];
    for (var i=0; i<2; i++) {
            
    }; 
    */   

    // add things to the world
    world.add([
        Physics.behavior('interactive', { el: renderer.container }).applyTo(bodies)
        ,gravity
        ,Physics.behavior('body-impulse-response')
        ,Physics.behavior('body-collision-detection')
        ,Physics.behavior('sweep-prune')
        ,edgeBounce
    ]);

    world.on({
        'interact:poke': function( pos ){
            gravity.position( pos );
        }
        ,'interact:release': function(){
            gravity.position(Physics.vector(renderer.width/2, renderer.height/2));
        }
    });

    function drawStadium() {
        if (stadium) {
            stadium.clear();
        };
        
        var stadiumThickness = 10;
        var points = 50;
        var stadiumParts = [];
        var outerRadius = scale(.5);

        var innerRadius = outerRadius-stadiumThickness;
        var averageRadius = (outerRadius+innerRadius)/2;
        
        var d = (2*Math.PI)/points
        for (i=0; i<(2*Math.PI); i+=d) {
            /*
            if (i < Math.PI/3) {
                continue;
            }; 

            if (i > (2/3)*Math.PI && i < Math.PI) {
                continue;
            };

            if (i > (4/3)*Math.PI && i < (5/3)*Math.PI) {
                continue;
            };
            */

            var bd = Physics.body('convex-polygon', {
                x: ((averageRadius-20)*Math.cos(i)) + (renderer.width/2)
                ,y:  ((averageRadius-20)*Math.sin(i)) + (renderer.height/2)
                ,vertices: [
                    {x: (outerRadius*Math.cos(i)) + (renderer.width/2), y:(outerRadius*Math.sin(i)) + (renderer.height/2)},
                    {x: (outerRadius*Math.cos(i+d)) + (renderer.width/2), y:(outerRadius*Math.sin(i+d)) + (renderer.height/2)},

                    {x: (innerRadius*Math.cos(i+d)) + (renderer.width/2), y:(innerRadius*Math.sin(i+d)) + (renderer.height/2)},
                    {x: (innerRadius*Math.cos(i)) + (renderer.width/2), y:(innerRadius*Math.sin(i)) + (renderer.height/2)},              
                ]
            })
            bd.state.angular.pos -= Math.PI/points;
            stadiumParts.push(bd);           
        };

        return stadiumParts;
    };
    

    stadium = Physics.body('compound', {
        x: window.innerWidth/2
        ,y: window.innerHeight/2
        ,children: drawStadium()
        ,vx: 0.3
        ,restitution: 1
        ,styles: {fillStyle: 'white'}    
        ,treatment: 'static' 
    });
    world.add(stadium);
    layer.addToStack(stadium);

    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function( time ) {world.step( time );});
});