var mraa = require('mraa');

var rgbLed = {
	red: new mraa.Gpio(5),
	green: new mraa.Gpio(6),
	blue: new mraa.Gpio(9)
}

var red = 255;
var green = 255;
var blue = 255;

for(var key in rgbLed) {
	var led = rgbLed[key];
	led.dir(mraa.DIR_OUT);
	led.write(1);
}
