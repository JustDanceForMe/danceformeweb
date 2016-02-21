// global vars
var cal = [0, 0, 0];
var alpha = 0;
var beta = 0;
var gamma = 0;

// max values
var axs = [];
var ays = [];
var azs = [];
var a = [0,0,0];
var modelData = {};

var epsilon = 3.0;

var firebase = new Firebase('https://dancegesture.firebaseio.com/');

// apply geometric correction to the acceleration values
// function coordinateTransformation(accel) {
// 	sin = numeric.sin;
// 	cos = numeric.cos;

// 	invR = [[cos(alpha) * cos(beta), 										sin(alpha) * cos(beta), 										-1 * sin(beta)],
// 			[cos(alpha) * sin(beta) * sin(gamma) - sin(alpha) * cos(gamma), sin(alpha) * sin(beta) * sin(gamma) + cos(alpha) * cos(gamma), 	cos(beta) * sin(gamma)],
// 			[cos(alpha) * sin(beta) * cos(gamma) + sin(alpha) * sin(gamma), sin(alpha) * sin(beta) * cos(gamma) - cos(alpha) * sin(gamma), 	cos(beta) * cos(gamma)]];

// 	return numeric.dot(invR, accel);
// }

// initialize page and begin sensor calibration
function init() {
	if (window.DeviceMotionEvent) {
		window.ondevicemotion = function(event) {
			ax = event.acceleration.x;
			ay = event.acceleration.y;
			az = event.acceleration.z;
			rotation = event.rotationRate;

			$('ax').text(ax);
			$('ay').text(ay);
			$('az').text(az);

			b = [ax, ay, az];

			// a = coordinateTransformation(b);

			a[0] = Math.abs(b[0]);
			a[1] = Math.abs(b[1]);
			a[2] = Math.abs(b[2]);

			// // update max values
			// if (a[0] > maxX) {
			// 	maxX = a[0];
			// }

			// if (a[1] > maxX) {
			// 	maxY = a[1];
			// }

			// if (a[2] > maxX) {
			// 	maxZ = a[2];
			// }
		}

		window.ondeviceorientation = function(event) {
			alpha = Math.round(event.alpha) - cal[0];
			beta = Math.round(event.beta) - cal[1];
			gamma = Math.round(event.gamma) - cal[2];

			$('alpha').text(alpha);
			$('beta').text(beta);
			$('gamma').text(gamma);
		}

		$('#cal').click(function() {
			cal[0] = Number($('alpha').text());
			cal[1] = Number($('beta').text());
			cal[2] = Number($('gamma').text());

			$(this).css('display', 'none');
			$('#ready').css('display', 'inline');			
		});


	}
}


$(function() {
	init();

	// ready to start the game
	$('#ready').click(function() {
		$(this).css('display', 'none');
		$('#stop').css('display', 'inline');

		// access firebase and synchronize beginning

		// sample rate 1 per 100 ms: 10hz
		window.setInterval(function() {
			axs.push(a[0]);
			ays.push(a[1]);
			azs.push(a[2]);
		}, 100);
	});

	$('#stop').click(function() {
		window.clearInterval();

		firebase.set({
			axs: axs,
			ays: ays,
			azs: azs
		}, function() {
			alert('tracking data is saved');
			$('#stop').css('display', 'none');
		});
	});
});