const nav = '<nav>\
				<ul>\
					<li><img src="./images/xuN8(2020).png" width="50" height="50"/></li>\
					<li><a href="./index.html">Home</a></li>\
					<li><span>|</span></li>\
					<li><a href="./spheres.html">Spheres</a></li>\
					<li><span>|</span></li>\
					<li><a href="./platformer.html">Platformer</a></li>\
				</ul>\
			</nav>'

const body = document.querySelector('body');
body.insertAdjacentHTML('afterbegin', nav);