"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _PSMove_instances, _PSMove_device, _PSMove_lastData, _PSMove_handle, _PSMove_color, _PSMove_rumble, _PSMove_lastColor, _PSMove_lastRumble;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PSMove = void 0;
const events_1 = __importDefault(require("events"));
const node_hid_1 = __importDefault(require("node-hid"));
const chroma_js_1 = __importDefault(require("chroma-js"));
const VENDOR_ID = 1356;
const PRODUCT_ID = 981;
class PSMove extends events_1.default {
    constructor(ready) {
        super();
        _PSMove_instances.add(this);
        _PSMove_device.set(this, void 0);
        _PSMove_lastData.set(this, {
            select: false,
            start: false,
            square: false,
            cross: false,
            circle: false,
            triangle: false,
            ps: false,
            move: false,
            trigger: 0,
            battery: { level: null, chargingStatus: 'not_charging' },
            accelerometer: { x: 0, y: 0, z: 0 },
            gyroscope: { x: 0, y: 0, z: 0 }
        });
        _PSMove_color.set(this, (0, chroma_js_1.default)(0x000000));
        _PSMove_rumble.set(this, 0);
        _PSMove_lastColor.set(this, (0, chroma_js_1.default)(0x000000));
        _PSMove_lastRumble.set(this, 0);
        (() => __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _PSMove_device, yield node_hid_1.default.HIDAsync.open(VENDOR_ID, PRODUCT_ID), "f");
            __classPrivateFieldGet(this, _PSMove_device, "f").on('data', buffer => __classPrivateFieldGet(this, _PSMove_instances, "m", _PSMove_handle).call(this, buffer));
            __classPrivateFieldGet(this, _PSMove_device, "f").on('error', e => this.emit('error', e));
            if (ready)
                ready();
        }))();
    }
    get battery() {
        var _a;
        return (_a = __classPrivateFieldGet(this, _PSMove_lastData, "f")) === null || _a === void 0 ? void 0 : _a.battery;
    }
    hex(hex) {
        if (hex === undefined)
            return __classPrivateFieldGet(this, _PSMove_color, "f").hex('rgb');
        __classPrivateFieldSet(this, _PSMove_color, (0, chroma_js_1.default)(hex), "f");
        return this;
    }
    rgb(r, g, b) {
        if (r === undefined)
            return __classPrivateFieldGet(this, _PSMove_color, "f").rgb(true);
        if (Array.isArray(r))
            __classPrivateFieldSet(this, _PSMove_color, (0, chroma_js_1.default)(r, 'rgb'), "f");
        else
            __classPrivateFieldSet(this, _PSMove_color, (0, chroma_js_1.default)(r, g, b, 'rgb'), "f");
        return this;
    }
    hsl(h, s, l) {
        if (h === undefined)
            return __classPrivateFieldGet(this, _PSMove_color, "f").hsl().slice(0, 2);
        if (Array.isArray(h))
            __classPrivateFieldSet(this, _PSMove_color, (0, chroma_js_1.default)(h, 'hsl'), "f");
        else
            __classPrivateFieldSet(this, _PSMove_color, (0, chroma_js_1.default)(h, s, l, 'hsl'), "f");
        return this;
    }
    rumble(rumble) {
        if (rumble === undefined)
            return __classPrivateFieldGet(this, _PSMove_rumble, "f");
        __classPrivateFieldSet(this, _PSMove_rumble, Math.min(Math.max(rumble, 0), 1), "f");
        return this;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__classPrivateFieldGet(this, _PSMove_device, "f"))
                return false;
            if (__classPrivateFieldGet(this, _PSMove_lastColor, "f").hex('rgb') === __classPrivateFieldGet(this, _PSMove_color, "f").hex('rgb') &&
                __classPrivateFieldGet(this, _PSMove_lastRumble, "f") === __classPrivateFieldGet(this, _PSMove_rumble, "f"))
                return true;
            __classPrivateFieldSet(this, _PSMove_lastColor, __classPrivateFieldGet(this, _PSMove_color, "f"), "f");
            __classPrivateFieldSet(this, _PSMove_lastRumble, __classPrivateFieldGet(this, _PSMove_rumble, "f"), "f");
            let [r, g, b] = __classPrivateFieldGet(this, _PSMove_color, "f").rgb(true);
            let rumble = Math.round(__classPrivateFieldGet(this, _PSMove_rumble, "f") * 0xff);
            return (yield __classPrivateFieldGet(this, _PSMove_device, "f").write([6, 0, r, g, b, 0, rumble, 0, 0])) > 0;
        });
    }
}
exports.PSMove = PSMove;
_PSMove_device = new WeakMap(), _PSMove_lastData = new WeakMap(), _PSMove_color = new WeakMap(), _PSMove_rumble = new WeakMap(), _PSMove_lastColor = new WeakMap(), _PSMove_lastRumble = new WeakMap(), _PSMove_instances = new WeakSet(), _PSMove_handle = function _PSMove_handle(buffer) {
    let data = decode(buffer);
    this.emit('data', data);
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").select && data.select)
        this.emit('buttonDown', { button: 'select', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").start && data.start)
        this.emit('buttonDown', { button: 'start', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").square && data.square)
        this.emit('buttonDown', { button: 'square', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").cross && data.cross)
        this.emit('buttonDown', { button: 'cross', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").circle && data.circle)
        this.emit('buttonDown', { button: 'circle', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").triangle && data.triangle)
        this.emit('buttonDown', { button: 'triangle', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").ps && data.ps)
        this.emit('buttonDown', { button: 'ps', state: true, data });
    if (!__classPrivateFieldGet(this, _PSMove_lastData, "f").move && data.move)
        this.emit('buttonDown', { button: 'move', state: true, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").select && !data.select)
        this.emit('buttonUp', { button: 'select', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").start && !data.start)
        this.emit('buttonUp', { button: 'start', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").square && !data.square)
        this.emit('buttonUp', { button: 'square', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").cross && !data.cross)
        this.emit('buttonUp', { button: 'cross', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").circle && !data.circle)
        this.emit('buttonUp', { button: 'circle', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").triangle && !data.triangle)
        this.emit('buttonUp', { button: 'triangle', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").ps && !data.ps)
        this.emit('buttonUp', { button: 'ps', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").move && !data.move)
        this.emit('buttonUp', { button: 'move', state: false, data });
    if (__classPrivateFieldGet(this, _PSMove_lastData, "f").trigger != data.trigger)
        this.emit('triggerChange', { amount: data.trigger, data });
    __classPrivateFieldSet(this, _PSMove_lastData, data, "f");
};
function getByte(buffer, offset, length = 1) {
    return buffer.subarray(offset, offset + length);
}
function toInt(buffer) {
    return parseInt(buffer.toString('hex'), 16);
}
function getBit(buffer, index) {
    return ((buffer[0] >> index) & 1) == 1;
}
function decode(buffer) {
    let startSelect = getByte(buffer, 0x01);
    let select = getBit(startSelect, 0);
    let start = getBit(startSelect, 3);
    let crossSquareCircleTriangle = getByte(buffer, 0x02);
    let square = getBit(crossSquareCircleTriangle, 7);
    let cross = getBit(crossSquareCircleTriangle, 6);
    let circle = getBit(crossSquareCircleTriangle, 5);
    let triangle = getBit(crossSquareCircleTriangle, 4);
    let psMove = getByte(buffer, 0x03);
    let ps = getBit(psMove, 0);
    let move = getBit(psMove, 3);
    let trigger = toInt(getByte(buffer, 0x06)) / 0xff;
    let bat = toInt(getByte(buffer, 0x0C));
    let battery = {
        level: bat <= 0x05 ? bat : null,
        chargingStatus: bat == 0xEE ? 'charging' :
            bat == 0xEF ? 'fully_charged' :
                'not_charging'
    };
    let accelerometer = {
        x: toInt(getByte(buffer, 0x13, 2)),
        y: toInt(getByte(buffer, 0x15, 2)),
        z: toInt(getByte(buffer, 0x17, 2))
    };
    let gyroscope = {
        x: toInt(getByte(buffer, 0x1f, 2)),
        y: toInt(getByte(buffer, 0x21, 2)),
        z: toInt(getByte(buffer, 0x23, 2))
    };
    return { select, start, square, cross, circle, triangle, ps, move, trigger, battery, accelerometer, gyroscope };
}
