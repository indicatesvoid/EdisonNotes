//
//  ViewController.m
//  edison_rgb_control
//
//  Created by William Clark on 2/24/15.
//  Copyright (c) 2015 William Clark. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    // init bluetooth //
    self.centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:nil];
    
    // init color picker //
    _colorPicker = [[RSColorPickerView alloc] initWithFrame:CGRectMake(0,0,_colorPickerFrame.frame.size.width, _colorPickerFrame.frame.size.height)];
    [_colorPicker setDelegate:self];
    [_colorPicker setCropToCircle:YES];
    _colorPickerFrame.backgroundColor = [UIColor clearColor];
    [_colorPickerFrame addSubview:_colorPicker];
    
    self.ready = NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - RSColorPickerDelegate
-(void) colorPickerDidChangeSelection:(RSColorPickerView *)cp {
    // send data //
    const CGFloat* components = CGColorGetComponents([[cp selectionColor] CGColor]);
    CGFloat red = components[0] * 255;
    CGFloat green = components[1] * 255;
    CGFloat blue = components[2] * 255;
    //    CGFloat alpha = components[3];
    
    uint8_t color[3];
    color[0] = (int)roundf(red);
    color[1] = (int)roundf(green);
    color[2] = (int)roundf(blue);
    
    NSLog(@"Color changed");
    
    if(self.ready) {
        NSLog(@"BLE Ready -- attempting write");
        uint8_t rgb[3] = { color[0], color[1], color[2] };
        NSData* data = [[NSData alloc] initWithBytes:rgb length:3];
        [self.peripheral writeValue:data forCharacteristic:self.rgbLedCharacteristic type:CBCharacteristicWriteWithoutResponse];
//        NSData* data = [[NSData alloc] initWithBytes:color length:3];
//        [self.peripheral writeValue:data forCharacteristic:self.rgbLedCharacteristic type:CBCharacteristicWriteWithoutResponse];
    } else {
        NSLog(@"We ain't ready!");
    }
}


#pragma mark - CBCentralManagerDelegate
// when it is powered on start looking for our peripheral
- (void)centralManagerDidUpdateState:(CBCentralManager *)central {
    if(central.state==CBCentralManagerStatePoweredOn)
    {
        NSLog(@"Starting scan...");
        CBUUID *serviceUUID = [CBUUID UUIDWithString:@"b1a67521-52eb-4d36-e13e-357d7c225465"];
        [central scanForPeripheralsWithServices:@[serviceUUID] options:nil];
    }
}

// central manager discovered a peripheral
- (void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI {
    NSLog(@"Found peripheral");
    self.peripheral = peripheral;
    [self.centralManager stopScan];
    self.peripheral.delegate = self;
    // make a connection to the peripheral
    [self.centralManager connectPeripheral:self.peripheral options:nil];
}

// connected, start discovering services
- (void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral {
    if(peripheral.state == CBPeripheralStateConnected) {
        NSLog(@"Connected");
        CBUUID *serviceUUID = [CBUUID UUIDWithString:@"b1a67521-52eb-4d36-e13e-357d7c225465"];
        [peripheral discoverServices:@[serviceUUID]];
    }
}

// services discovered - find their characteristics
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error {
    for (CBService *service in peripheral.services) {
        NSLog(@"Found service with UUID: %@", service.UUID);
        [peripheral discoverCharacteristics:nil forService:service];
    }
}

// discovered some characteristics
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error {
    for (CBCharacteristic *characteristic in service.characteristics) {
        NSLog(@"Found characteristic with UUID: %@", characteristic.UUID);
        if([characteristic.UUID isEqual:[CBUUID UUIDWithString:@"9e739ec2-b3a2-4af0-c4dc-14f059a8a62d"]]) {
            NSLog(@"Found RGB LED Characteristic");
            self.rgbLedCharacteristic = characteristic;
            
            self.ready = YES;
            
            // attempt write //
            uint8_t rgb[3] = { 255, 255, 0 };
            [self setColor:rgb];
            
            [peripheral setNotifyValue:YES forCharacteristic:characteristic];
        }
//        [peripheral readValueForCharacteristic:characteristic];
//        [peripheral setNotifyValue:YES forCharacteristic:characteristic];
    }
}

// this is called in response to the readValueForCharacteristic and also when the peripheral notifies us of changes
- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error {
    // get the value
    NSMutableString* value = [[NSMutableString alloc] init];
    
    const uint8_t *bytes = (const uint8_t*)[characteristic.value bytes];
    
    for(size_t i = 0; i < characteristic.value.length; i++) {
        uint8_t thisByte = bytes[i];
        [value appendFormat:@"%hhu", thisByte];
//        [value appendString:byteString];
        if(i != characteristic.value.length-1) [value appendString:@","];
    }
    // see which characteristic was updated
    if(characteristic == self.rgbLedCharacteristic) {
        NSLog(@"BLE reported RGB value: %@", value);
    }
}

#pragma mark - misc
-(void)setColor:(uint8_t[3])color {
    NSLog(@"Attempting write");
    NSData* data = [[NSData alloc] initWithBytes:color length:3];
    [self.peripheral writeValue:data forCharacteristic:self.rgbLedCharacteristic type:CBCharacteristicWriteWithoutResponse];
}

-(void)setBlue:(NSTimer*)timer {
    uint8_t rgb[3] = { 0, 0, 255 };
    [self setColor:rgb];
}

@end
