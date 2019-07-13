// import module (will create a reference in the global scope)
import './main.js';

// identify the global scope
let _global = typeof window === 'object' && window.self === window && window ||
            typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global;

// retrieve a copy of the constructor from the global scope
let _Timer = _global.Timer;

// delete the Constructgor global scope reference
delete _global.Timer;

// export the Constructor as a ES6 module
export {_Timer as Timer};