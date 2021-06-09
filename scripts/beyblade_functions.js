var stadium;



function randInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// translation of the entire canvas
var translation = Physics.vector(0,0); 

// bounds of the window
var viewportBounds = Physics.aabb(0, 0, window.innerWidth, window.innerHeight);

// create a renderer
var renderer = Physics.renderer('canvas', {
    el: 'viewport'
});

function scale(factor) {
    return (renderer.height > renderer.width && renderer.width || renderer.height) * factor;
};

// dedicated layer for beyblades
var layer = renderer.addLayer('beyblades', null, {
    width: window.innerWidth,
    height: window.innerHeight,
    zIndex: 2
});

// constrain objects to these bounds
var edgeBounce = Physics.behavior('edge-collision-detection', {
    aabb: viewportBounds
    ,restitution: 0.99
    ,cof: 0.8
});

var gravity = Physics.behavior('attractor', {
                pos: Physics.vector(window.innerWidth/2, window.innerHeight/2),
                order: 0,
                strength: 0.02//0.01
            });

var canvas = document.querySelector('canvas');
var ctx = renderer.ctx;
var positions = [];
var bodies = [];

function storeLastPosition (self, xPos, yPos) {
    var motionTrailLength = 30; 
       
    // push an item
    self.positions.push({
      x: xPos,
      y: yPos
    });

    //get rid of first item
    if (self.positions.length > motionTrailLength) {
      self.positions.shift();
    }
  } 


    /*
    // add some fun interaction
    var attractor = Physics.behavior('attractor', {
        order: 0,
        strength: 0.01
    });
    world.on({
        'interact:poke': function( pos ){
            world.wakeUpAll();
            attractor.position( pos );
            world.add( attractor );
        }
        ,'interact:move': function( pos ){
            attractor.position( pos );
        }
        ,'interact:release': function(){
            world.wakeUpAll();
            world.remove( attractor );
        }
    });
    */