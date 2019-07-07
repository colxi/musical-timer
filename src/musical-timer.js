import {Timer} from '../node_modules/advanced-timer/src/advanced-timer.js';
import './musical-timer-core.js';

// identify the global scope
let _global = typeof window === 'object' && window.self === window && window ||
            typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global;

// retrieve a copy of the MidiParser reference and store it
let _MusicalTimer = _global.MusicalTimer;

// attach the timmr
_MusicalTimer.attachTimer( Timer );

// delete the global scope reference
delete _global.MusicalTimer;

// export the stored MidiParser reference
export {_MusicalTimer as MusicalTimer};