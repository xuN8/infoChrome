const nav = '<nav>\
				<ul>\
					<li><a href="index.html"><img src="images/xun8(2020).png" width="50" height="50"/></a></li>\
					<li><a href="index.html">Home</a></li>\
					<li><a href="spheres.html">Spheres</a></li>\
					<li><a href="platformer.html">Platformer</a></li>\
					<li><a href="wiggle.html">Wiggle</a></li>\
					<li><a href="beyblade.html">Beyblade</a></li>\
					<li><a href="infoChrome/index.html" target="_blank">InfoChrome</a></li>\
				</ul>\
			</nav>'

const body = document.querySelector('body');
body.insertAdjacentHTML('afterbegin', nav);