var mraa = require('mraa');
var pin13 = new mraa.Gpio(13);
pin13.dir(mraa.DIR_OUT);
pin13.write(1);
