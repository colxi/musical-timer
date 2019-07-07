let MusicalTimer = require('../src/musical-timer-core.js');

let lastBeat = 0;
let lastBar = 0;

let myTimer = new MusicalTimer( ()=>{

    if(myTimer.bar !== lastBar ){
        lastBar = myTimer.bar;
        console.log(' ')
        console.log('Bar ' + myTimer.bar)

    }

    if(myTimer.beat !== lastBeat ){
        lastBeat = myTimer.beat;
        console.log('...Beat ' + myTimer.beat)
    }

    console.log('...... SubBeat ' + myTimer.subBeat)
});

myTimer.signature = '4/4';
myTimer.tempo = 120;
myTimer.resolutionFactor = 2;

console.log('The timer is set to run a 4/4 signature, at 120bpm , with a beat resolution of 4 sub-beats (resolution factor 2)')
console.log('Use Ctrl+C to stop the execution')
myTimer.play();

