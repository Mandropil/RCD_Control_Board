  #include <EEPROM.h>
  #include <SoftwareSerial.h>
  #include <SPI.h>
  
  
  #define softRX 2
  #define softTX 3
  
  SoftwareSerial softSerial(softRX, softTX); 
  
  int slaveSelectPin[]={4,5,6};
  
  char pot_data[21];
  char c;
  char inData[10];
  char compare = '*';
  int index=0;
  byte temp_val;
  byte check;


  
  byte dev_type = 2;
  String dev_name = "Type2_Case4";
  
  
  
  
  void setup() {
    Serial.begin(115200);     // Serieller Monitor
    
    Serial.println("AT-Kommando-Modus => ");
  
    pinMode(slaveSelectPin[0], OUTPUT);
    pinMode(slaveSelectPin[1], OUTPUT);
    pinMode(slaveSelectPin[2], OUTPUT);
    SPI.begin();
  
    check = EEPROM.read(0);
    
  
    
    
    //if (check > 42){
    if (false){
        dev_type = EEPROM.read(20);
    
      for (int i = 1;i<19;i++){
        temp_val = EEPROM.read(i);  
        pot_data[i] = temp_val;
        digitalPotMap(i,temp_val);
      }
      softSerial.begin(115200); // Verbindung zu HM-10 0=9600 2=38400 4=115200  5=4800  
      Serial.println("Wiederherstellen");
    }
    else {
      EEPROM.write(20,dev_type);  
      softSerial.begin(115200); // Verbindung zu HM-10 0=9600 2=38400 4=115200  5=4800
      Serial.println("Init start");
      softSerial.print("AT");
      read_serial();
  
      Serial.println("Init Name");
      softSerial.print("AT+NAME" + dev_name);
      read_serial();

      Serial.println("Init Baud");
      softSerial.print("AT+BAUD4" );
      read_serial();
  
      Serial.println("Init ROLE0");
      softSerial.print("AT+ROLE0");
      read_serial();
  
      Serial.println("Init MODE2");
      softSerial.print("AT+MODE2");
      read_serial();
  
      Serial.println("Init WORK1");
      softSerial.print("AT+WORK1");
      read_serial();
  
      Serial.println("Init TYPE3");
      softSerial.print("AT+TYPE3");
      read_serial();
  
      Serial.println("Init PASS");
      softSerial.print("AT+PASS189314");
      read_serial();
  
      Serial.println("Reset");
      softSerial.print("AT+RESET");
      read_serial();
      
       EEPROM.write(0,43);  
      for (int i = 1;i<19;i++){
        //EEPROM.write(i,0);  
        digitalPotMap(i,10);
      }
      Serial.println("Initialisierung abgeschlossen");
    }
    
  }
  
  void loop() {
    // Meldungen vom HM-10 lesen und
    // am seriellen Monitor ausgeben
    while (softSerial.available()) {
      
      
      c = softSerial.read();
      Serial.print(c); 
      inData[index] = c;
      index++;
       if(c==compare)
       {
          Serial.println("Kommando Ende");
          index = 0;
          parse_data();
       }
       else
       {
          
          
       }
  
        
      
    }
  
    
    while (Serial.available()) {
      c = Serial.read();
      Serial.print(c); 
      softSerial.print(c);
      
    }
    
  
    
  }
  void read_serial(){
    delay(30);
    
    while (softSerial.available()) {
        c = softSerial.read();
        Serial.print(c); 
    }
    Serial.println();
  }
  
  
  
  void parse_data(){
    char switch1;
    switch1 = inData[0];
    Serial.print("Wert0: ");
    Serial.println(switch1);
  
    
    if (switch1 =='I'){
      Serial.println("Anweisung");
      temp_val = EEPROM.read(20);  
      //softSerial.print("01FFEEDDCCBBAA009988776655443322113344");  
      
      for (int i=0;i<19;i++){
          softSerial.print(pot_data[i]);  
      }
      softSerial.print(temp_val);  
      Serial.println(temp_val);
      
    }
    if (switch1 =='S'){
      
      for (int i = 1;i<19;i++){
        EEPROM.write(i,pot_data[i]);  
        
      }
     
      Serial.println("Gespeichert!");
    }
    if (switch1 =='O'){
      
      for (int i = 1;i<19;i++){
        digitalPotMap(i,0);
      }
      
      Serial.println("Aus!");
    }

    if (switch1 =='N'){
    
      for (int i = 1;i<19;i++){
          temp_val = EEPROM.read(i);  
          pot_data[i] = temp_val;
          digitalPotMap(i,temp_val);
        }
        Serial.println("An!");
    }

    if (switch1 =='T'){
       char channel[2];
      channel[0]=inData[1];
      channel[1]=inData[2];
      channel[2]='\00';
      int channel_b = atoi(channel);
      for (int i = 1;i<19;i++){
        EEPROM.write(20,channel_b);  
        
      }
      EEPROM.write(0,43);  
      Serial.println("Gespeichert!");
    }
    
    if (switch1 =='L'){
      Serial.println(inData);
      char channel[2];
      channel[0]=inData[1];
      channel[1]=inData[2];
      channel[2]='\00';
      int channel_b = atoi(channel);
      char c_value[4]; 
      c_value[0]=inData[3];
      c_value[1]=inData[4];
      c_value[2]=inData[5];
      c_value[3]='\00';
      
      int c_value_b = atoi(c_value);
      
      pot_data[channel_b]=c_value_b;
      digitalPotMap(channel_b,c_value_b);
    }
    
      
    
  }
  
  /*------------------Datenübertragung an die Potis ----------------------------------------------*/
  
  void digitalPotWrite(int channel,int address, int value) {
    // take the SS pin low to select the chip:
    digitalWrite(slaveSelectPin[channel], LOW);
    //  send in the address and value via SPI:
    SPI.transfer(address);
    SPI.transfer(255-value);
    // take the SS pin high to de-select the chip:
    digitalWrite(slaveSelectPin[channel], HIGH);
  }
  
  
  
  /*------------------Mapping der 18 Kanaäle auf die Potis und die Slave Kanäle --------------------*/
  
  void digitalPotMap(byte channel,byte value){
    switch (channel){
      case 1:
      digitalPotWrite(2,1,value);  
        break;
      case 2:
      digitalPotWrite(2,0,value);
        break;
      case 3:
      digitalPotWrite(2,2,value);
        break;
      case 4:
      digitalPotWrite(2,4,value);
        break;
      case 5:
      digitalPotWrite(0,3,value);
        break;
      case 6:
      digitalPotWrite(0,1,value);
        break;
      case 7:
      digitalPotWrite(0,0,value);
        break;
      case 8:
      digitalPotWrite(0,2,value);
        break;
      case 9:
      digitalPotWrite(0,4,value);
        break;
      case 10:
      digitalPotWrite(1,5,value);
        break;
      case 11:
      digitalPotWrite(1,2,value);
        break;
      case 12:
      digitalPotWrite(1,0,value);
        break;
      case 13:
      digitalPotWrite(1,4,value);
        break;
      case 14:
      digitalPotWrite(0,5,value);
        break;
      case 15:
      digitalPotWrite(1,1,value);
        break;
      case 16:
      digitalPotWrite(1,3,value);
        break;
      case 17:
      digitalPotWrite(2,5,value);
        break;
      case 18:
      digitalPotWrite(2,3,value);
        break;
        
    }
  }
  
  

