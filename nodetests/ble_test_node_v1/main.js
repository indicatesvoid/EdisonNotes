var RGBLed = require('./rgbLed.js');
var Galileo = require("galileo-io");
var board = new Galileo();
var led = new RGBLed(board, 5, 6, 9);

var bleno = require("bleno");
var RGBLedService = require("./rgb-led-service.js");
var ledService = new RGBLedService(led);

board.on("ready", function() {
	console.log("ready");
	
	led.init();
	led.setRGB(0,0,0);
});	

bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);

  	if (state === 'poweredOn') {
    		bleno.startAdvertising('led', [ledService.uuid]);
  	} else {
  		bleno.stopAdvertising();
  	}
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  
  if (!error) {
    bleno.setServices([
  	ledService 
    ]);
  }
});
