export class Helper {

    public static Delay(ms: number): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}