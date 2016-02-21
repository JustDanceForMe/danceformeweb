var cal = [0, 0, 0];
var maxX = 0;
var maxY = 0;
var maxZ = 0;
var alpha = 0;
var beta = 0;
var gamma = 0;

function coordinateTransformation(accel) {
	sin = numeric.sin;
	cos = numeric.cos;

	invR = [[cos(alpha) * cos(beta), 										sin(alpha) * cos(beta), 										-1 * sin(beta)],
			[cos(alpha) * sin(beta) * sin(gamma) - sin(alpha) * cos(gamma), sin(alpha) * sin(beta) * sin(gamma) + cos(alpha) * cos(gamma), 	cos(beta) * sin(gamma)],
			[cos(alpha) * sin(beta) * cos(gamma) + sin(alpha) * sin(gamma), sin(alpha) * sin(beta) * cos(gamma) - cos(alpha) * sin(gamma), 	cos(beta) * cos(gamma)]];

	return numeric.dot(invR, accel);
}

function init() {
	if (window.DeviceMotionEvent) {
		window.ondevicemotion = function(event) {
			// ax = event.accelerationIncludingGravity.x;
			// ay = event.accelerationIncludingGravity.y;
			// az = event.accelerationIncludingGravity.z;
			ax = event.acceleration.x;
			ay = event.acceleration.y;
			az = event.acceleration.z;
			rotation = event.rotationRate;

			$('ax').text(ax);
			$('ay').text(ay);
			$('az').text(az);

			a = [ax, ay, az];

			a = coordinateTransformation(a);

			a[0] = Math.abs(a[0]);
			a[1] = Math.abs(a[1]);
			a[2] = Math.abs(a[2]);

			// update max values
			if (a[0] > maxX) {
				maxX = a[0];
			}

			if (a[1] > maxX) {
				maxY = a[1];
			}

			if (a[2] > maxX) {
				maxZ = a[2];
			}


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

			$('abg').text('alpha: ' + cal[0] + ' / beta: ' + cal[1] + ' / gamma: ' + cal[2]);
			$(this).css('display', 'none');
			$('#reset').css('display', 'inline');			
		});

		$('#reset').click(function() {
			cal = [0, 0, 0];

			$('abg').text('alpha: 0 / beta: 0 / gamma: 0');
			$(this).css('display', 'none');
			$('#cal').css('display', 'inline');
		});
	}
}

$(function() {
	init();

	
	
});