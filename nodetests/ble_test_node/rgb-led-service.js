var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

var RGBLedCharacteristic = require("./rgb-led-characteristic.js");

function RGBLedService(led) {
	RGBLedService.super_.call(this, {
		uuid: 'b1a6752152eb4d36e13e357d7c225465',	
 		characteristics: [
      			new RGBLedCharacteristic(led) 
    		]
  	});

	console.log("RGBLedService created successfully");
}

util.inherits(RGBLedService, BlenoPrimaryService);

module.exports = RGBLedService;
