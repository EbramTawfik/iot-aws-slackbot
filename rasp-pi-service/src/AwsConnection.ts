import { device, DeviceOptions } from 'aws-iot-device-sdk';
import * as path from 'path';
export class AwsConnection {

    private awsDevice: device = null;


    private _isConnected: boolean;
    public get IsConnected(): boolean {
        return this._isConnected;
    }  
 



    public Init(): void {

        console.log(path.resolve(__dirname, '.', 'assets', 'certificate.pem.crt'));
        console.log(path.resolve(__dirname, '.', 'assets', 'private.pem.key'));

        const deviceOptions: DeviceOptions = {
            certPath: path.resolve(__dirname, '.', 'assets', 'certificate.pem.crt'),
            caPath: path.resolve(__dirname, '.', 'assets', 'root.ca.pem.crt'),
            keyPath: path.resolve(__dirname, '.', 'assets', 'private.pem.key'),
            clientId: "slackbot",   
            host: "agpm5udu9liwm-ats.iot.us-east-2.amazonaws.com"
        };

        console.log("Init1");
        this.awsDevice = new device(deviceOptions);
        console.log("Init2");
        this.awsDevice.on("error", (e) => this.onError(e))
        this.awsDevice.on("connect", () => this.onConnect())

    }

    public Publish(topic: string, data: any) {
        if (this.awsDevice) {
            this.awsDevice.publish(topic, data);   
        }
   
    } 
 

    private onConnect() {
        console.log('AWS connect');
        this._isConnected = true;
    }

    private onError(error: Error | string) {
        console.log('AWS Error', JSON.stringify(error, null, 4));

    }

}