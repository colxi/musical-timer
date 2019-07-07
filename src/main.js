// inject MusicalTimer in te global Scope. This solution 
// allows the package to be included as a Script element
import {MusicalTimer} from './musical-timer.js';
window.MusicalTimer = MusicalTimer;
