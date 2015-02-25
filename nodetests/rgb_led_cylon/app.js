var Cylon = require('cylon');

Cylon.api('http');

Cylon.robot({
	connections: {
		edison: { adaptor: 'intel-iot' }
	},

	devices: {
		ledRed: { driver: 'led', pin: 5 },
		ledGreen: { driver: 'led', pin: 6 },
		ledBlue: { driver: 'led', pin: 9 }
	},

	work: function(my) {
		var brightness = 0,
			fade = 5,
			index = 0,
			keys = Object.keys(my.devices);

		every((0.05).seconds(), function() {
			brightness += fade;
			
			if(index == 0) my.ledRed.brightness(brightness);
			else if(index == 1) my.ledGreen.brightness(brightness);
			else if(index == 2) my.ledBlue.brightness(brightness);
			
			if(brightness === 0 || brightness === 255) {
				if(index === 2) {
					index = 0;
					fade = -fade;
				} else {
					brightness = (fade > 0) ? 0 : 255;
					index++;
				}
			}
		});
	}
}).start();
