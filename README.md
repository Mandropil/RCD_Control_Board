# RCD_Control_Board
18 Channel PCB with Arduino,  BLE Module, analogue dimming and Cordova App

The board found in the folder "Lichtkasten" can drive up to 18 channels of LED 
with a current limited only by the RCD drivers installed (370ma and 700ma tested) 

The Arduino Nano is driving 3 6 way digital pots with a scale of 256 positions each. 

Digital pots are used for getting non PWM and thus not pulsing lights. 

When the power source is clean, the LEDs are driven wit constand current. 

The <b>AD5206</b> is a 6 channel potentiometer with SPI interface






