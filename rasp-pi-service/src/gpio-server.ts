import { Gpio, BinaryValue } from 'onoff';
import { Helper } from './Helper';




class GpioServer {

    constructor() {
        try {

            const button = new Gpio(23, "in", "rising");

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
}


const gpioService = new GpioServer();