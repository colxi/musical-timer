
# advanced-timer
[![NoDependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://github.com/colxi/midi-parser-js)
[![Browser](https://img.shields.io/badge/browser-compatible-blue.svg)](https://github.com/colxi/midi-parser-js)
[![Node](https://img.shields.io/badge/node-compatible-brightgreen.svg)](https://www.npmjs.com/package/midi-parser-js)

Advanced timer with pause/resume/reset capabilites, conditional cycle execution, onComplete tasks scheduling, live timer delay manipullation, and much more.

```javascript
  import {Timer} from 'advanced-timer.js';
  // run myFunc 50 times every 1000ms
  let myTimer = new Timer( 1000 ).action( myFunc ).repeat( 50 ).start();
```
Some features:
- Chainable constructor 
- Able to Pause/resume/reset 
- Live delay change ( Timer.delay() I)
- Conditional cycles ( Timer.if() )
- On complete callbacks ( Timer.done() )
- Live iterations count change ( Timer.repeat() )
- Sync lost detection ( Timer.inSync )
- Cycle timestamp, deltaTime...
- Node & Browser compatible (Node Module, ES6 module , Script Inlcude)
- **Tiny and Zero dependencies**

See it in action [here](https://colxi.github.io/advanced-timer/demo/demo-browser-fancy.html).

## Usage example

Create a timer that executes 50 times the callback every 1000ms (only when timer cycle remains in sync), and execute an onComplete callback when done.

```javascript
  let myTimer = new Timer( 1000 )
      .action( t=> console.log(t.currentCycle) )
      .if( t=> t.inSync )
      .repeat( 50 )
      .done( t=> console.log('completed!') )
      .start();
```

## Package distribution :

The following distribution channels are available to download and install the package :

- **NPM** : Install the package using the NPM network :

```bash
$ npm install advanced-timer --save
```

- **GIT** : Clone the repository from Github (or download the latest ZIP package release [here](https://github.com/colxi/advanced-timer/releases/latest) )


```bash
 $ git clone https://github.com/colxi/advanced-timer.git
```

- **CDN** : Include this library in the HEAD of your HTML :

```html
<script src='https://colxi.info/advanced-timer/src/main.js'></script>
```

## Import/Include the library

This library can be imported in Node using ...
```javascript
let Timer = require('advanced-timer'); 
```

Imported (ES6 module) in the browser using ...
```javascript
import {Timer} from './library-path/src/advanced-timer.js';
```

Or included in the browser adding in your HTML head ...
```html
<script src='./library-path/src/main.js'></script>
<!-- window.Timer, is created -->
```


# Constructor

Create a new timer instance using:

```javascript
  let myTimer = new Timer( milliseconds );
```

- `milliseconds` : Integer representing the delay betwen cycles.

> **IMPORTANT**: The Constructor deesn't start the Timer, it only sets and returns the new timer Instance. You mus call the `start` , and assign an `action` method, in order to start it .


# Timer prototype methods

### Timer.prototype.action
Sets the function to be executed in each timer cycle. **Is required to be able to start the timer.**
```javascript
    Timer.prototype.action( callback );
```

- `callback`: Function to execute in each timer cycle. The function execution context will be binded to the timer (unless if declared as arrow functon), and will recieve a reference to the timer objct as the first argument.

> Note: Action callback can be changed any time.


### Timer.prototype.start
Starts the timer. If timer is paused, will be resumed.

```javascript
   Timer.prototype.start();
```
> If the timer is completed (status 3) must be reseted first in order to use it again.


### Timer.prototype.stop
Stops the timer and resets all its values.

```javascript
    Timer.prototype.stop();
```

### Timer.prototype.pause
Pauses the timer.

```javascript
    myTimer.pause();
```

### Timer.prototype.resume
Resumes the timer.

```javascript
    Timer.prototype.resume();
```

> Only a paused timer (status 2) can be resumed.


### Timer.prototype.repeat
Sets the ammount of cycles before the timer stops. By default, if `repeat` is not set, the timer will run infinitelly. 
```javascript
    Timer.prototype.repeat( times );
```
- `times`:  Positive integer (or `Boolean`) representing the ammount of cycles to execute. If `false ` is set, a single cycle wil be executed. If set to `true` will run infinitelly.

> Note: Can be changed any time.


### Timer.prototype.delay
Sets the delay betwen each timer cycle

```javascript
    Timer.prototype.delay( milliseconds );
```
- `milliseconds`: Integer representing ammount of milliseconds betwen each cycle callback execution.

> Note: Delay time can be changed any time.

### Timer.prototype.reset
Resets the timer and all its atributes. It also sets the timer status to `stopped`, unless the timer was reseted in `running` state in such case, it starts running again automatically after the reset.

```javascript
    Timer.prototype.reset();
```
> Note: Reset allows to re-initialize a `completed` timer.

### Timer.prototype.if
Sets a callback to be executed before each cycle call. If returns true the cycle callback will be executed, but ommited if returns false.

```javascript
    Timer.prototype.if( callback );
```
- `callback`: Function to be executed. Function recieves the timer reference as the first argument¡

> Note : Conditional callback can be disabled any time, by providing `false` as argument: `myTimer.if( false ) `


### Timer.prototype.done
Sets the callback to be executed when the timer reaches the las scheduled cycle.

```javascript
    Timer.prototype.done( callback );
```
- `callback`: Function to be executed. Function recieves the timer reference as the first argument¡

### Timer.prototype.destroy
Destroys the timer and all its internal properties. Timer becomes unusable after being destroyed. Lets the Garbage Collector discard the instance reference.
```javascript
    Timer.prototype.destroy();
```

### Timer.prototype.setSyncThreshold
Sets the out of sync threshold in ms. If a cycle `deltaTime` exceeds the timer freqency (`timerDelay`) by an ammount of miliseconds higher than the set threshold, the `inSync` flag, will become false.
```javascript
    Timer.prototype.setSyncThreshold( ms );
```
- `ms`: Positive integer representing the ammountof miliseconds.


## Timer prototype properties

- `Timer.prototype.statusCode` : Integer representing the timer status (-1,0,1,2,3)
- `Timer.prototype.status` : String representing the status of the timer ( destroyed, stopped, running, paused, completed)
- `Timer.prototype.inSync`: Boolean. When cycle callback can't be executed respecting the provided `delay + syncThreshold`, `ìnSync` becomes `false`.
- `Timer.prototype.timerDelay`: Integer representing the timer frequency.
- `Timer.prototype.timestamp`: Integer represemting the current timestamp.
- `Timer.prototype.currentCycle`: Integer. Cycle counter.
- `Timer.prototype.cycleLimit`: Integer representing the total ammount of cyles to be executed before timer stops.
- `Timer.prototype.cycleTimestamp` : Integer representing te timestamp corresponding to the current cycle starting time, relative to the timer start.
- `Timer.prototype.cycleDeltatime`: Integer representing the ammount of milliseconds, since the last cycle.If the cycle is `ìnSync` must match (or almost) with the provided `delay`value.
- `Timer.prototype.syncThreshold` : Integer representing the ammount of miliseconds. (default value 20ms)

## Licence 
MIT
