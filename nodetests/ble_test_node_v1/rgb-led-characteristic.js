var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function RGBLedCharacteristic(rgbled) {
	RGBLedCharacteristic.super_.call(this, {
		uuid: '9e739ec2b3a24af0c4dc14f059a8a62d',
		properties: ['read', 'writeWithoutResponse'],
		descriptors: [
			new BlenoDescriptor({
				uuid: '2901',
				value: 'read or write RGB led value'
			})
		]
	});

	this.led = rgbled;
	
	console.log("RGBLedCharacteristic created successfully");
}

util.inherits(RGBLedCharacteristic, BlenoCharacteristic);

RGBLedCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if(offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	} else {
	}
};

RGBLedCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	console.log("got write request");
	if(offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	} else if (data.length != 3) {
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
	} else {
		var r = data.readUint8(0);
		var g = data.readUint8(1);
		var b = data.readUint8(2);

		console.log("r: " + r);
		console.log("g: " + g);
		console.log("b: " + b);

		this.led.setRGB(r, g, b);
		callback(this.RESULT_SUCCESS);
	}
};

module.exports = RGBLedCharacteristic;		



