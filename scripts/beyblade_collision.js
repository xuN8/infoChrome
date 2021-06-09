function onCollision(data) {
	var rx = randInt(-1, 2);
	var ry = randInt(-1, 2);
	translation.add(rx,ry);
	ctx.translate(rx,ry);
	layer.options.offset = translation;

	setTimeout(() => {
	    translation.add(-rx, -ry);
	    ctx.translate(-rx,-ry);
	    layer.options.offset = translation;
	}, 100);  

	/*
	//console.log(data);
	var c = data.collisions[0];
	if (c.bodyA.treatment == 'dynamic' && c.bodyB.treatment == 'dynamic') {
	    if (randInt(0, 5) == 0) {
	        if (world.timestep() == 6) {
	            world.timestep(6*0.1)
	            world.warp(0.1); 
	            setTimeout(() => {
	                world.warp(1);
	                world.timestep(6);
	            }, 500);  
	        };  
	    };             
	}; 
	*/
};