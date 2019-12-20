import { Gpio, BinaryValue } from 'onoff';
import { Helper } from './Helper';




class GpioServer {

    constructor() {
        try {

           // Test the Gpio Using LED
           // var LED = new Gpio(4, 'out'); 
           // var blinkInterval = setInterval(() => this.blinkLED(LED), 1000);

             const button = new Gpio(4, "in", "falling");
             button.watch((err, value) => this.onButtonChange(err, value));

             console.log("Service Started...");
        }
        catch
        {

        }
    }


    private onButtonChange(err: Error | null | undefined, value: BinaryValue) {
        if (err) {
            throw err;
        }
        if (value === Gpio.LOW) {
            console.log("Button Pressed...");
            Helper.Delay(200);
        }

    }

    private blinkLED(LED) { 
        if (LED.readSync() === 0) { 
            LED.writeSync(1); 
        } else {
            LED.writeSync(0); 
        }
    }

}


const gpioService = new GpioServer();