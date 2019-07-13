![](https://img.shields.io/badge/Javascript-ES6-orange.svg)
![](https://img.shields.io/badge/CSS-Custom_Properties-blue.svg)

# musical-timer 

Generate configurable Musical Timers, that can be adjusted to the requested tempo (BPM), running with the desired beat subdivision resolution, adjusted to the provided time signature stucture. The internal clock will trigger a callback call in each cycle, providing information about the current, BAR, BEAT and SUB-BEAT.

Main Features :
- Adjustable Tempo (up to 200 bpm)
- Supported time signatures : 2/4 | 3/4 | 4/4 | 6/8 | 9/8 | 12/8
- Supported time subdivision Modes : Binary / Ternary 
- Beat subdivision resolution up to 𝅘𝅥𝅱 ( sixty-fourth note, hemidemisemiquave, 1/16th of a beat)
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

Demo: [See it in action](https://colxi.info/musical-timer/test/browser-test-import.html)


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
<script src="https://colxi.info/musical-timer/src/main.js" type="module"></script>
```

# Import/Include
You can import/include this library in Browser & Node enviroment:

- **Node** : You can require the library (after installing it with `npm`) with :

```javascript
const MusicalTimer = require('musical-timer');
```

- **Browser (import)** : You can import the library with :

```javascript
import {MusicalTimer} from './path-to/musical.timer.js';
```


- **Browser (include)** : You can include in your HTML head. The Constructor will become available as `window.MusicalTimer`

```html
<script src="./path-to/musical-timer/src/main.js" type="module"></script>
```



# Constructor Syntax

The `MusicalTimer()` Constructor creates a new `MusicalTimer Instance`. 

```javascript
var musicalTimerInstance = new MusicalTimer( tickHandler [, tempo] )
```

## Parameters

* **`tickHandler`**:
**(Required)**. A callback function to be called in each clock tick. The callback will be bound to the new timer instance, and will recieve a reference to the instance as a first argument, when called.

* **`tempo`**:
(Optional) Number representing the clock tempo. (Default: `60`)



#  Methods & Properties

The following reference, documents all the **methods & properties** available in a `MusicalTimer` instance :

> ### _musicalTimerInstance_.**play()**

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

> _musicalTimerInstance_.**bar**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an integer representing the current musical **bar**

> _musicalTimerInstance_.**beat**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an integer representing the current **beat** in the bar.

> _musicalTimerInstance_.**beatSubdivision**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an integer representing the **ammount of elements** a beat can contain considering the resolution factor.

> _musicalTimerInstance_.**beatsPerBar**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an integer representing the **ammount of beats** each bar contain, according to the time signature.

> _musicalTimerInstance_.**inSync**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an boolean representing the **clock sync status**. If the provided callback function is not performant, clock could run out of sync.

> _musicalTimerInstance_.**resolutionFactor** 

Accepts an integer (range 0-4) to set the beat subdivision resolution ( Default=0 ). Resolution levels are :
- 𝅘𝅥 0 : Each beat has 0 sub-beats - quarter note (crotchet) - 
- 𝅘𝅥𝅮 1 : Each beat has 2 sub-beats - eighth note (quaver) -
- 𝅘𝅥𝅯 2 : Each beat has 4 sub-beats - sixteenth note (semiquaver) -
- 𝅘𝅥𝅰 3 : Each beat has 8 sub-beats - thirty-second note (demisemiquaver)
- 𝅘𝅥𝅱 4 : Each beat has 8 sub-beats - sixty-fourth note	(hemidemisemiquaver) -

Depending on the resolution level, each timer tick, will represent _a crotchet, a quaver, a semiquaver_...

> _musicalTimerInstance_.**signature** 

Accepts a string representing the time signature ( Default='4/4' ). Accepted time signatures are :
- 2/4 (binary - 𝅘𝅥 𝅘𝅥 )
- 3/4 (binary - 𝅘𝅥 𝅘𝅥 𝅘𝅥 )
- 4/4 (binary - 𝅘𝅥 𝅘𝅥 𝅘𝅥 𝅘𝅥 )
- 6/8 (ternary - 𝅘𝅥 𝅘𝅥 )
- 9/8 (ternary - 𝅘𝅥 𝅘𝅥 𝅘𝅥 ) 
- 12/8 (ternary - 𝅘𝅥 𝅘𝅥 𝅘𝅥 𝅘𝅥 )

> _musicalTimerInstance_.**status**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. String representing the status of the timer : _'stopped' , 'running' , 'paused'_

> _musicalTimerInstance_.**statusCode**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Integer representations of the status of the timer : _0, 1, 2_

> _musicalTimerInstance_.**subBeat**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Returns an integer representing the current **subbeat** in the beat.

> _musicalTimerInstance_.**tempo** 

Accepts a positive number ( range 1-200 ) representing the beats per minute (bpm) clock frequency. ( Default=60 )

> _musicalTimerInstance_.**tick**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Integer representing the clock's current tick.

> _musicalTimerInstance_.**tickDeltatime**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Integer representing the time in miliseconds since the last clock tick.

> _musicalTimerInstance_.**tickInterval**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Integer representing the theoretical time in miliseconds betwen ticks (considering the beat resolution and tempo).

> _musicalTimerInstance_.**timestamp**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. Integer representing the time passed since timer was started, in miliseconds

> _musicalTimerInstance_.**timestampFormated**  ![Read only](https://colxi.info/musical-timer/docs/lock.png)

Read only. String representing the time passed since timer was started, in the format hh:mm:ss:SS





# Usage example
In the following example the `Constructor` is called to create a musical timer, handled by a function that outputs the timer state in each tick.
:
```javascript
import {MusicalTimer} from './path-to/musical-timer.js';

// Create a new timer and asign a tick handler
let myTimer = new MusicalTimer( function(){
    console.log( `${this.timestampFormated} : SubBeat ${this.subBeat} of Beat ${this.beat} of bar ${this.bar}` );
});

// configure timer to run at 120bpm
myTimer.tempo = 120;
// with a 2/4 signature ( 2 beats per bar in binary mode )
myTimer.signature = '2/4';
// and a beat subdivision of 2 sub-beats ( 𝅘𝅥𝅮, eighth note, quaver )
myTimer.resolutionFactor = 1;
// start timer!
myTimer.play();
```

Output  :
```javascript
00:00:00.00 : SubBeat 1 of Beat 1 of bar 1
00:00:00.25 : SubBeat 2 of Beat 1 of bar 1
00:00:00.50 : SubBeat 1 of Beat 2 of bar 1
00:00:00.75 : SubBeat 2 of Beat 2 of bar 1
00:00:01.00 : SubBeat 1 of Beat 1 of bar 2
00:00:01.25 : SubBeat 2 of Beat 1 of bar 2
00:00:01.50 : SubBeat 1 of Beat 2 of bar 2
00:00:01.75 : SubBeat 2 of Beat 2 of bar 2
00:00:02.00 : SubBeat 1 of Beat 1 of bar 3
...
```
