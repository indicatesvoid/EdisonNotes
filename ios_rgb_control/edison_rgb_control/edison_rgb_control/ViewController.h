//
//  ViewController.h
//  edison_rgb_control
//
//  Created by William Clark on 2/24/15.
//  Copyright (c) 2015 William Clark. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "RSColorPickerView.h"

@interface ViewController : UIViewController <CBCentralManagerDelegate, CBPeripheralDelegate, RSColorPickerViewDelegate>

    @property(nonatomic, strong) CBCentralManager* centralManager;
    @property(nonatomic, strong) CBPeripheral* peripheral;
    @property(nonatomic, strong) CBCharacteristic* rgbLedCharacteristic;

    @property (weak, nonatomic) IBOutlet UIView *colorPickerFrame;
    @property (nonatomic) RSColorPickerView* colorPicker;

    @property (nonatomic) BOOL ready;

    -(void)setColor:(uint8_t[3])color;
    -(void)setBlue:(NSTimer*)timer;

@end

