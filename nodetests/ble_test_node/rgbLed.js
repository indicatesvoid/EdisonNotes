//var mraa = require('mraa');
var io = require("galileo-io");

function RGBLed(board, redPin, greenPin, bluePin) {
	/*this.redPin = new mraa.Gpio(redPin);
	this.greenPin = new mraa.Gpio(greenPin);
	this.bluePin = new mraa.Gpio(bluePin);

	redPin.dir(mraa.DIR_OUT);
	greenPin.dir(mraa.DIR_OUT);
	bluePin.dir(mraa.DIR_OUT);*/

	this.redValue = 255;
	this.greenValue = 255;
	this.blueValue = 255;

	this.redPin = redPin;
	this.greenPin = greenPin;
	this.bluePin = bluePin;
	this.board = board;
}

RGBLed.prototype.init = function() {
	this.board.pinMode(this.redPin, this.board.MODES.OUTPUT);
        this.board.pinMode(this.greenPin, this.board.MODES.OUTPUT);
        this.board.pinMode(this.bluePin, this.board.MODES.OUTPUT);
}

RGBLed.prototype.degamma = function(n) {
  return Math.floor(((1 << Math.floor(n / 32)) - 1) +
          Math.floor((1 << Math.floor(n / 32)) * Math.floor((n % 32) + 1) + 15) / 32);
};

RGBLed.prototype.write = function() {
	this.board.analogWrite(this.redPin, this.redValue);
	this.board.analogWrite(this.greenPin, this.greenValue);
	this.board.analogWrite(this.bluePin, this.blueValue);
};

RGBLed.prototype.setRGB = function(r, g, b) {
	this.redValue = 255 - r;
	this.greenValue = 255 - g;
	this.blueValue = 255 - b;

	this.write();
};

RGBLed.prototype.getRed = function() {
	return 255 - this.redValue;
};

RGBLed.prototype.getGreen = function() {
	return 255 - this.greenValue;
};

RGBLed.prototype.getBlue = function() {
	return 255 - this.blueValue;
};

module.exports = RGBLed;
