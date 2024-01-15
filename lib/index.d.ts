/// <reference types="node" />
import EventEmitter from 'events';
export declare interface PSMove {
    on(event: 'data', listener: (data: Data) => void): this;
    on(event: 'error', listener: (error: any) => void): this;
    on(event: 'buttonDown' | 'buttonUp', listener: (event: ButtonEvent) => void): this;
    on(event: 'triggerChange', listener: (event: TriggerEvent) => void): this;
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
export declare class PSMove extends EventEmitter {
    #private;
    constructor(ready?: () => void);
    get battery(): Battery;
    destroy(): Promise<void>;
}
export interface Battery {
    level: number | null;
    chargingStatus: 'not_charging' | 'charging' | 'fully_charged';
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
export interface ButtonEvent {
    button: 'select' | 'start' | 'square' | 'cross' | 'circle' | 'triangle' | 'ps' | 'move';
    state: boolean;
    data: Data;
}
export interface TriggerEvent {
    amount: number;
    data: Data;
}
