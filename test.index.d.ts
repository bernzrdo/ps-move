
declare module 'ps-move' {

    export class PSMove {

        constructor(ready?: ()=>void);
    
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
    
        update(): Promise<boolean>;
        
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

}
