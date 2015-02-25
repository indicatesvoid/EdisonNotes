var Cylon = require('cylon');

Cylon.api('http');

Cylon.robot({
	connections: {
		edison: { adaptor: 'intel-iot' }
	},

	devices: {
		led: { driver: 'led', pin: 13 },
		button: { driver: 'button', pin: 12 }
	},

	work: function(my) {
		my.button.on('push', function() {
			my.led.toggle();
		});
	}
}).start();
