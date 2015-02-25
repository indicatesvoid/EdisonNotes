var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function RGBLedCharacteristic(rgbled) {
	RGBLedCharacteristic.super_.call(this, {
		uuid: '9e739ec2b3a24af0c4dc14f059a8a62d',
		properties: ['read','notify', 'writeWithoutResponse', 'write'],
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

RGBLedCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log("RGBLedCharacteristic subscribed to");
	this.notifyInterval = setInterval(function() {
		if(this.colorChanged) {
			var data = new Buffer(3);
			data.writeUInt8(this.led.getRed(), 0);
			data.writeUInt8(this.led.getGreen(), 1);
			data.writeUInt8(this.led.getBlue(), 2);

			console.log("RGBLedCharacteristic notify: " + data[0] + "," + data[1] + "," + data[2]);
			updateValueCallback(data);

			this.colorChanged = false;
		}
	}.bind(this), 250);
};

RGBLedCharacteristic.prototype.onUnsubscribe = function() {
	console.log("RGBLedCharacteristic Unsubscribe");
	if(this.notifyInterval) {
		clearInterval(this.notifyInterval);
		this.notifyInterval = null;
	}
};

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
		var r = data.readUInt8(0);
		var g = data.readUInt8(1);
		var b = data.readUInt8(2);

		this.r = r;
		this.g = g;
		this.b = b;

		this.colorChanged = true;

		console.log("r: " + r);
		console.log("g: " + g);
		console.log("b: " + b);

		this.led.setRGB(r, g, b);
		callback(this.RESULT_SUCCESS);
	}
};

module.exports = RGBLedCharacteristic;		



