![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/CSS-Custom_Properties-blue.svg)

# musical-timer 

Generate configurable Musical Timers, that can be adjusted to the requested tempo (BPM), running with the desired beat subdivision resolution, adjusted to the provided time signature stucture. The internal clock will trigger a callback call in each cycle, providing information about the current, BAR, BEAT and SUB-BEAT.

Main Features :
- Adjustable Tempo (up to 200 bpm)
- Supported time signatures : 2/4 | 3/4 | 4/4 | 6/8 | 9/8 | 12/8
- Supported time subdivision Modes : Binary / Ternary 
- Beat subdivision resolution up to sixty-fourth note (hemidemisemiquave, 1/16th of a beat)
- Tracks clock Sync 
- Controls : Play / Pause / Resume / Stop (Reset)
- Highly Performant
- Third party dependencies free



```javascript
import {MusicalTimer} from './path-to/musical-timer.js';

// Create a new timer, handled by a function called myTickHandler
let myTimer = new MusicalTimer( myTickHandler );
// configure and start ticking
myTimer.tempo = 120;
myTimer.signature = '2/4';
myTimer.play();
// -> myTickHandler will be executed every 500ms (120bpm) 
```

Demo: [See it in action](https://colxi.github.io/musical-timer/test/browser-test-import.html)


# Syntax

The `MusicalTimer()` Constructor creates a new `MusicalTimer Instance`. 

```javascript
var musicalTimerInstance = new MusicalTimer( tickHandler [, tempo] )
```

## Parameters

* **`tickHandler`**:
**(Required)**. A callback function to be called in each clock tick. The callback will be bound to the new timer instance, and will recieve a reference to the instance as a first argument, when called.

* **`tempo`**:
(Optional) Number representing the clock tempo. (Default: `60`)


# Installation
You can choose between any of the following available distribution channels:

- **GIT**: Clone the repository locally using git (or download the latest release [here](https://github.com/colxi/musical-timer/releases/latest))
 ```bash
 $ git clone https://github.com/colxi/musical-timer.git
```

- **NPM**: Install it using npm. 
 ```bash
$ npm install musical-timer -s
```

- **CDN**: Include the script in your HTML header (`window.MusicalTimer` will be created).
 ```html
<script src="https://colxi.info/musical-timer/src/main.js"></script>
```

#  Properties & Methods

> _musicalTimerInstance_.**play()**

Starts (or resumes when paused) the timer.
```javascript
let myTimer = new MusicalTimer( ()=>{} )
myTimer.play(); // clock starts ticking
```

> _musicalTimerInstance_.**pause()** 

Pauses the timer. If timer is stopped, the request is ignored.
```javascript
let myTimer = new MusicalTimer( ()=>{} )
myTimer.play();
myTimer.pause(); // pause clock
```

> _musicalTimerInstance_.**stop()** 

Stops the timer, and resets its initial values.
```javascript
let myTimer = new MusicalTimer( ()=>{} )
myTimer.play();
myTimer.stop(); // timer stops and gets reseted
```

> _musicalTimerInstance_.**bar**  ![](https://colxi.info/musical-timer/docs/lock.png)


> _musicalTimerInstance_.**beats**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**beatSubdivision**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**beatsPerBar**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**inSync**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**resolutionFactor** 

> _musicalTimerInstance_.**signature** 

> _musicalTimerInstance_.**status**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**statusCode**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**subBeat**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**tempo** 

> _musicalTimerInstance_.**tick**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**tickDeltatime**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**tickInterval**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**timestamp**  ![](https://colxi.info/musical-timer/docs/lock.png)

> _musicalTimerInstance_.**timestampFormated**  ![](https://colxi.info/musical-timer/docs/lock.png)

Holds the timer current tempo value (bpm). Only accepts positive numbers. Limited to 200bpm by default

> _musicalTimerInstance_.**signature** 




# Usage
The `Constructor` returns a `Proxy Object` and any regular Object operation can be performed on it (except property deletion). In the following list, you will find examples of the the most common operations and interactions: 

**Import and Construct**:
```javascript
import {CSSGlobalVariables} from './css-global-variables.js';
let cssVar = new CSSGlobalVariables();
```

**Set** a new value to a CSS global variable:
```javascript
/* The following assigments to '--myVariable' behave equally, and are all valid */
cssVar.myVariable = 'newValue';
cssVar['myVariable'] = 'newValue';
cssVar['--myVariable'] = 'newValue';
```

**Get** the value of a CSS global variable:
```javascript
/* The following value retrievals for '--myVariable' behave equally, and are all valid */
console.log( cssVar.myVariable );
console.log( cssVar['myVariable'] );
console.log( cssVar['--myVariable'] );
```

**Enumeration** of all declared CSS global variables, through iteration:
```javascript
for( let v in cssVar ){
    console.log( v , '=', cssVar[v] );
}
```


# Variable Name Normalization
`Normalize functions` (implemented by [@SebastianDuval](https://github.com/SebastianDuval) ) allow you to perform automatic transformations of the variable names, to make them more suitable for the javascript syntax, or to simply addapt them to your coding style and personal preferences.

In the following example a CSS variable declared using hyphens (`--my-css-variable`), can be accessed in Javascript using the widelly used camelCase style (`myCssVariable`), thanks to the `camelToHyphens` normalize function (and the native `autoprefixer`):

CSS:
```html
<style>
   :root{
        --my-css-variable: 'red';
    }
</style>
```
Javascript: 
```javascript
let camelToHyphens = function(name){
    return name.replace(/[A-Z]/g, m => "-" + m.toLowerCase() );
}
let cssVar = new CSSGlobalVariables( { normalize:camelToHyphens });

cssVar.myCssVariable = 'blue';
```


# Automatic DOM Change Tracking

The library uses a DOM Mutation Observer to detect new inclusion in the document. Thanks to this observer, new CSS variables are available automatically when new styles are attached to the document.  


# CORS Restrictions
CSSGlovalVariables will face limitations when trying to extract the CSS definitions of a remote stylesheet (except for same-origin urls). Restrictions applied by the browser, based in the Cross Origin Policy will block any access attempt.

In such a scenario, a warning will be printed in the console, and the affected style element will be flagged and ignored by the library.

To prevent this restriction, add the `crossorigin` attribute to the `<link>` element:

```html
<link rel="stylesheet" crossorigin="anonymous" href="https://www.a-remote-server/styles.css">
```
If the server is configured to allow CORS (through the  **Access-Control-Allow-Origin** directive) the CORS restrictions should disapear.
