import { Gpio, BinaryValue } from 'onoff';
import { connect, Client, Packet, IPublishPacket } from 'mqtt';
import { Helper } from './Helper';
import { AwsConnection } from './AwsConnection';




class GpioServer {
    private client: Client;
    private awsConnection: AwsConnection;
    constructor() {
        try {

            // Test the Gpio Using LED
            // var LED = new Gpio(4, 'out'); 
            // var blinkInterval = setInterval(() => this.blinkLED(LED), 1000);

            console.log("Service Started...");

            this.setupAWS();
            // this.setupMQTT();
            this.setupGPIO();

            console.log("-------------------------");


        }
        catch
        {

        }
    }

    private setupAWS() {
        this.awsConnection = new AwsConnection();
        this.awsConnection.Init();
    }

    private setupGPIO(): void {
        //Button GPIO Setup 
        const button = new Gpio(4, "in", "falling");
        button.watch((err, value) => this.onButtonChange(err, value));

        console.log("GPIO Setup Done ...");
    }

    private onButtonChange(err: Error | null | undefined, value: BinaryValue): void {
        if (err) {
            throw err;
        }
        const pub_topic = "home/switches/buttonChange";

        if (value === Gpio.LOW) {
            console.log("Button Pressed...");
            const message = {
                "buttom": {
                    "id": 1,
                    "name": "slackbot",
                    "state": "PRESSED"
                }
            };
            this.awsConnection.Publish(pub_topic, JSON.stringify(message));
            //this.client.publish(pub_topic, "PRESSED");
            Helper.Delay(200);
        }

    }

    private setupMQTT(): void {
        // MQTT Details
        const broker_address = "test.mosquitto.org";
        const client_id = "slackbot";
        const sub_topic = "home/switches/buttonChange";

        this.client = connect(`mqtt://${broker_address}`, {
            clientId: client_id
        });

        this.client.on('message', (topic, payload, packet) => this.mQTTMessageReceived(topic, payload, packet));
        this.client.subscribe(sub_topic);

        console.log("MQTT Setup Done ...");
    }



    private mQTTMessageReceived(topic: string, payload: Buffer, packet: Packet): void {
        let recPacket = packet as IPublishPacket;

        // console.log(JSON.stringify(packet, null, 4));

        console.log("message received ", payload.toString());
        console.log("message topic=", recPacket.topic);
        console.log("message qos=", recPacket.qos);
        console.log("message retain flag=", recPacket.retain);
        console.log("-------------------------");
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