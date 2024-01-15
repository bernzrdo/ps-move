import chroma from 'chroma-js';
import { PSMove } from '../src/index';

let move = new PSMove(()=>{
    console.log('Connected! Click some buttons to test the LEDs and rumble.')
});

function wave(){
    return (Math.cos(Date.now() / 250) + 1) / 2;
}

move.on('data', data=>{

    move.hex(0x000000);

    if(data.square)   move.hex('f0a');
    if(data.triangle) move.hex('0fa');
    if(data.cross)    move.hex('05f');
    if(data.circle)   move.hex('f03');

    if(data.move)     move.hsl(Date.now() / 10 % 360, 1, .5);
    if(data.ps)       move.hsl(0, 0, wave());

    move.rumble(data.trigger);

    move.update();

});

move.on('error', e=>{
    console.log(e);
});

move.on('buttonDown', e=>{

    console.log(e);

    if(e.button == 'start'){
        console.log(move.battery);
    }

    if(e.button == 'select'){
        console.log('SELECT: Down!');
    }

});

move.on('buttonUp', e=>{

    if(e.button == 'select'){
        console.log('SELECT: Up!');
    }

});

move.on('triggerChange', e=>{

    console.log(Array(Math.round(e.amount * 50)).fill('▇').join(''));

});