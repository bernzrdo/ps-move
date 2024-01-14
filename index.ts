import EventEmitter from 'events';
import HID from 'node-hid';
import chroma from 'chroma-js';

const VENDOR_ID = 1356;
const PRODUCT_ID = 981;

export declare interface PSMove {

    on(event: 'data', listener: (data: Data) => void): this;
    on(event: 'error', listener: (error: any) => void): this;

    hex(): string;
    hex(hex: string | number): this;

    rgb(): [number, number, number];
    rgb(rgb: [number, number, number]): this;
    rgb(r: number, g: number, b: number): this;
    
    hsl(): [number, number, number];
    hsl(hsl: [number, number, number]): this;
    hsl(h: number, s: number, l: number): this;

    rumble(): number;
    rumble(rumble: number): this;

}

export class PSMove extends EventEmitter {

    #device: HID.HIDAsync | undefined;
    
    constructor(ready?: ()=>void){
        super();
        (async ()=>{

            this.#device = await HID.HIDAsync.open(VENDOR_ID, PRODUCT_ID);

            this.#device.on('data', (data: Buffer)=>{
                this.emit('data', decode(data));
            });
            
            this.#device.on('error', e=>this.emit('error', e));
            
            if(ready) ready();

        })();
    }

    #color = chroma(0x000000);
    
    hex(hex?: string | number){
        if(hex === undefined) return this.#color.hex('rgb');
        
        this.#color = chroma(hex);
        return this;
    }

    rgb(r?: number | [number, number, number], g?: number, b?: number){
        if(r === undefined) return this.#color.rgb(true);
        
        if(Array.isArray(r))
            this.#color = chroma(r, 'rgb');
        else
            this.#color = chroma(r, g!, b!, 'rgb');

        return this;
    }

    hsl(h?: number | [number, number, number], s?: number, l?: number){
        if(h === undefined) return this.#color.hsl().slice(0, 2);
        
        if(Array.isArray(h))
            this.#color = chroma(h, 'hsl');
        else
            this.#color = chroma(h, s!, l!, 'hsl');

        return this;
    }

    #rumble = 0;

    rumble(rumble?: number){
        if(rumble === undefined) return this.#rumble;
        
        this.#rumble = Math.min(Math.max(rumble, 0), 1);
        return this;
    }

    #lastColor = chroma(0x000000);
    #lastRumble = 0;

    /** Update color and rumble */
    async update(){
        if(!this.#device) return false;
        
        if(
            this.#lastColor.hex('rgb') === this.#color.hex('rgb') &&
            this.#lastRumble === this.#rumble
        ) return true;
        
        this.#lastColor = this.#color;
        this.#lastRumble = this.#rumble;

        let [r, g, b] = this.#color.rgb(true);
        let rumble = Math.round(this.#rumble * 0xff);

        // This was a headache to find...
        // https://github.com/thp/psmoveapi/blob/master/src/psmove.c#L123-L132

        return await this.#device.write([ 6, 0, r, g, b, 0, rumble, 0, 0]) > 0;
        
    }
    
}

export interface Battery {
    level: number | null;
    chargingStatus: 'not_charging'|'charging'|'fully_charged'
}

export interface Vector3 {
    x: number;
    y: number;
    z: number;
}

export interface Data {

    select: boolean;
    start: boolean;

    square: boolean;
    cross: boolean;
    circle: boolean;
    triangle: boolean;

    ps: boolean;
    move: boolean;

    trigger: number;

    battery: Battery;
    accelerometer: Vector3;
    gyroscope: Vector3;

}

function getByte(buffer: Buffer, offset: number, length: number = 1){
    return buffer.subarray(offset, offset + length);
}

function toInt(buffer: Buffer){
    return parseInt(buffer.toString('hex'), 16);
}

function getBit(buffer: Buffer, index: number){
    return ((buffer[0] >> index) & 1) == 1;
}

function decode(data: Buffer): Data {

    // Thank you to @nitsch 🫶
    // https://github.com/nitsch/moveonpc/wiki/Input-report

    let startSelect = getByte(data, 0x01);

    let select = getBit(startSelect, 0);
    let start = getBit(startSelect, 3);
    
    let crossSquareCircleTriangle = getByte(data, 0x02);

    let square = getBit(crossSquareCircleTriangle, 7);
    let cross = getBit(crossSquareCircleTriangle, 6);
    let circle = getBit(crossSquareCircleTriangle, 5);
    let triangle = getBit(crossSquareCircleTriangle, 4);

    let psMove = getByte(data, 0x03);

    let ps = getBit(psMove, 0);
    let move = getBit(psMove, 3);

    let trigger = toInt(getByte(data, 0x06)) / 0xff;

    let bat = toInt(getByte(data, 0x0C));
    let battery: Battery = {
        level: bat <= 0x05 ? bat : null,
        chargingStatus:
            bat == 0xEE ? 'charging' :
            bat == 0xEF ? 'fully_charged' :
            'not_charging'
    }

    let accelerometer: Vector3 = {
        x: toInt(getByte(data, 0x13, 2)),
        y: toInt(getByte(data, 0x15, 2)),
        z: toInt(getByte(data, 0x17, 2))
    }

    let gyroscope: Vector3 = {
        x: toInt(getByte(data, 0x1f, 2)),
        y: toInt(getByte(data, 0x21, 2)),
        z: toInt(getByte(data, 0x23, 2))
    }

    return { select, start, square, cross, circle, triangle, ps, move, trigger, battery, accelerometer, gyroscope };

}