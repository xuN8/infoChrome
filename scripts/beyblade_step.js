function onStep() {
    ctx.clearRect(0,0,canvas.width,canvas.height);


    for (i=0; i<bodies.length; i++) {
        //console.log(bodies[i].state);
        bodies[i].state.angular.vel = document.getElementById('spin').value;
        bodies[i].mass = document.getElementById('mass').value;
        storeLastPosition(bodies[i], bodies[i].state.pos.x, bodies[i].state.pos.y);
        
        for (var j = 0; j < bodies[i].positions.length; j++) {
            var ratio = (j + 1) / bodies[i].positions.length;

            ctx.lineCap = 'round';
            ctx.strokeStyle = bodies[i].styles.fillStyle;//"rgba(204, 102, 153, " + ratio / 2 + ")";
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
    };



    //world.render();
    layer.render();

    gravity.options.strength = document.getElementById('strength').value;
    gravity.options.order = document.getElementById('order').value;
};
    