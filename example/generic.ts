import chroma from 'chroma-js';
import { PSMove } from '../src/index';

let move = new PSMove(()=>{
    console.log('Connected! Click some buttons to test the LEDs and rumble.')
});

function wave(){
    return (Math.cos(Date.now() / 250) + 1) / 2;
}

move.on('data', data=>{

    move.rgb(199, 210, 39);
    console.log(move.hsl());

    move.hex(0x000000);

    if(data.square)   move.hex('f0a');
    if(data.triangle) move.hex('0fa');
    if(data.cross)    move.hex('05f');
    if(data.circle)   move.hex('f03');

    if(data.move)     move.hsl(Date.now() / 10 % 360, 1, .5);
    if(data.ps)       move.hsl(0, 0, wave());

    if(data.select){
        let scale = chroma.scale(['000', '0bf']);
        move.hex(scale(wave()).hex());
    }
    
    if(data.start){
        let scale = chroma.scale(['f4b', '000']);
        move.hex(scale(wave()).hex());
    }
    
    if(data.select && data.start){
        let scale = chroma.scale(['f4b', '0bf']);
        move.hex(scale(wave()).hex());
    }

    move.rumble(data.trigger);

    move.update();

});