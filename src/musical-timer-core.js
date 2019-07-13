(function(){
    'use strict';

    /***************************************************************************** 
     * 
     * ENGINE CONSTANTS
     * 
     *****************************************************************************/ 

    // Constants to define time Subtivision modes
    const SUBDIVISION_BINARY    = 0;
    const SUBDIVISION_TERNARY   = 1;

    // The following hash table returns the ammount of subbeats
    // a beat can contain according to the beatResolutionFactor
    // and the beatSubdivisionMode (index 0=binary, index 1=ternary)
    const BEAT_SUBDIVISION =[ 
        [1,2,4,8,16],
        [1,3,6,12,24]
    ];
    
    // Definition of supported time signatures
    const  ALLOWED_SIGNATURES = [
        '2/4',  // Binary
        '3/4',  // Binary
        '4/4',  // Binary
        '6/8',  // Ternary
        '9/8',  // Ternary
        '12/8'  // Ternary
    ];

    // Tempo Min and Max Values
    const TEMPO_MIN				= 1;		// minimum bps value
    const TEMPO_MAX				= 200;		// maximum bps value

    let _Timer;
    // if executed from Node, require the advanced-timer library
    if(typeof module !== 'undefined' && module.exports ) _Timer = require('advanced-timer');
    // If executed in browser, check if advanced-timer library is available. If is available keep a reference to it.
    // If not available needs to be provided manually (using MusicalTimer.attachTimer() )
    else if( typeof Timer !== 'undefined' ) _Timer = Timer;
    

    /***************************************************************************** 
     * 
     * CONSTRUCTOR
     * 
     *****************************************************************************/ 
    function MusicalTimer( CALLBACK, TEMPO=60 ){
        // force use 'new'
        if( !new.target ) return new MusicalTimer( ...arguments );

        // Validate provided Callback function
        if( typeof CALLBACK !== 'function' ) throw new Error('Expecting a function as first argument');
        
        // Validate Tempo value
        if( typeof TEMPO !== 'number' || TEMPO<TEMPO_MIN || TEMPO>TEMPO_MAX ) throw new Error('Second argument must be a number (range '+TEMPO_MIN+'-'+TEMPO_MAX+')');

        // bind the callback to the instance
        CALLBACK = CALLBACK.bind( this );

        /***************************************************************************** 
         * 
         * VARIABLEs , FLAGS and COUNTERS
         * 
         *****************************************************************************/ 

        // Internal Timer variables
        let tempo 					= TEMPO;		// timer tempo (bps)
        let signatureNominator      = 4;		// first value of a time signature ( eg. 3/4 = 3 )
        let signatureDenominator    = 4;		// second value of a time signature ( eg. 3/4 = 4 )
        let beatSubdivisionMode		= SUBDIVISION_BINARY;
        let beatResolutionFactor    = 2;        // The resolution factor is used to
                                                // calculate the time beat subdivision
                                                
        // Position Counters 
        let currentTick 			= 1;
        let currentBeat				= 1;
        let currentSubBeat		 	= 1;     	
        let currentBar				= 1;


        // initialize the internal clock
        let internalClock = new _Timer( calculateTickInterval()  ).action( nextTick );

        /***************************************************************************** 
         * 
         * INTERNAL & HELPER FUNCTIONS
         * 
         *****************************************************************************/ 

        /**
         * 
         * initializeCounters() : Resets the counter to its initial
         *                        values. 
         * 
         */
        function initializeCounters(){
            currentTick 			= 1;
            currentBeat				= 1;
            currentSubBeat		 	= 1;  
            currentBar				= 1;
            return true;
        };


        /**
         * 
         * calculateTickInterval() : Calculates the time betwen ticks
         *                           considering the tempo and the resolution
         */
        function calculateTickInterval(){ 
            let subBeatsPerBeat = BEAT_SUBDIVISION[beatSubdivisionMode][beatResolutionFactor]; 
            return  ( 60 / tempo / subBeatsPerBeat * 1000 ) << 0;
        };


        /**
         * formatTimestamp() : Transforms the provided timestamp of ellapsed time
         *                     into a hh:mm:ss:mm formated string 
         */
        function formatTimestamp(duration){
            // quick and dirty patch : formating fails when duration is lower than 3 ms
            if(duration<3) return '00:00:00.00';

            var milliseconds = parseInt((duration%1000)/10);
            var seconds = parseInt((duration/1000)%60);
            var minutes = parseInt((duration/(1000*60))%60);
            var hours = parseInt((duration/(1000*60*60))%24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }

        /**
         * nextTick() : Is executed each time the internal clock 
         *              triggers a tick, moves the counters and performs
         *              the user callback function call
         */
        function nextTick(){
            currentTick++;
            currentSubBeat++;

            // update musical counters  (currentBeat, currentBar)
            let subBeatsPerBeat = BEAT_SUBDIVISION[beatSubdivisionMode][beatResolutionFactor]; 
            if (currentSubBeat > subBeatsPerBeat ){ // if end of beat reached...
                currentSubBeat = 1;
                currentBeat++;
                let beatsPerBar =  (beatSubdivisionMode === SUBDIVISION_BINARY) ? signatureNominator : signatureNominator / 3;
                if(currentBeat > beatsPerBar){ // if complete bar beats reached...
                    currentBeat = 1;
                    currentBar++;
                }
            }

            CALLBACK();
            return true;
        }

    

        /***************************************************************************** 
         * 
         * PUBLIC API
         * 
         *****************************************************************************/ 


        Object.defineProperty(this, "play", {
            value : function(){
                if( internalClock.statusCode === 0 ) CALLBACK();
                internalClock.start()
                return true;
            },
            configurable : false,
            enumerable : true
        });


        Object.defineProperty(this, "pause", {
            value : function() {
                if( internalClock.statusCode === 1 ) internalClock.pause()
                return true;
            },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "stop", {
            value : function() {
                internalClock.stop();
                initializeCounters();
                return true;
            },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "tempo", {
            get(){ return tempo },
            set(newTempo){
                // cast to type number
                newTempo = Number(newTempo);
                // validate input
                if( !Number.isInteger(newTempo) ) throw new Error('Invalid tempo provided(' + newTempo + ')');
                // apply limits
                if(newTempo < TEMPO_MIN) newTempo = TEMPO_MIN;
                if(newTempo > TEMPO_MAX) newTempo = TEMPO_MAX;
                // assign new tempo
                tempo = newTempo;
                // adjust new timming
                internalClock.delay( calculateTickInterval() );
                // done!
                return true;
            },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "signature", {
            get(){ return signatureNominator+'/'+signatureDenominator },
            set(ts){
                // input value validaion
                if( ALLOWED_SIGNATURES.indexOf(ts) === -1 )  throw new Error('Invalid time Signature value ("' + ts + '"). Allowed signatures are : ' + JSON.stringify(ALLOWED_SIGNATURES) );
                let tsParts = ts.split("/");
                tsParts[0] = Number( tsParts[0] );
                tsParts[1] = Number( tsParts[1] );
                // set specs musical for requested time signature
                beatSubdivisionMode = (tsParts[1] === 4) ? SUBDIVISION_BINARY : SUBDIVISION_TERNARY;
                // store signature parts
                signatureNominator = tsParts[0];		
                signatureDenominator = tsParts[1];		
                // adjust new timing
                internalClock.delay( calculateTickInterval() );
                // done!
                return true;
            },
            configurable : false,
            enumerable : true
        });


        Object.defineProperty(this, "resolutionFactor", {
            get(){ return beatResolutionFactor },
            set(factor){
                // cast to type number
                factor = Number(factor);
                // validate input
                if( !Number.isInteger(factor)  || factor < 0 || factor > 4 ) throw new Error('Resolution Factor must be an Integer (0-4)');
                // store new factor
                beatResolutionFactor = factor;
                // adjust new timming
                internalClock.delay( calculateTickInterval() );
                // done!
                return true;
            },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "status", {
            get(){ return internalClock.status },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "statusCode", {
            get(){ return internalClock.statusCode },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "beatsPerBar", {
            get(){ return (beatSubdivisionMode === SUBDIVISION_BINARY) ? signatureNominator : signatureNominator / 3 },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "beatSubdivision", {
            get(){ return BEAT_SUBDIVISION[beatSubdivisionMode][beatResolutionFactor] },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "tick", {
            get(){ return currentTick },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "tickInterval", {
            get(){ return calculateTickInterval() },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "tickDeltatime", {
            get(){ return internalClock.cycleDeltatime },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "subBeat", {
            get(){ return currentSubBeat },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "beat", {
            get(){ return currentBeat },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "bar", {
            get(){ return currentBar },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "timestamp", {
            get(){ return internalClock.timestamp },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "timestampFormated", {
            get(){ return formatTimestamp(internalClock.timestamp) },
            configurable : false,
            enumerable : true
        });

        Object.defineProperty(this, "inSync", {
            get(){ return internalClock.inSync },
            configurable : false,
            enumerable : true
        });


        return this;

    }

    MusicalTimer.attachTimer = function( timer ){
        _Timer = timer;
        return true;
    }


    // if running in NODE export module
    if(typeof module !== 'undefined') module.exports = MusicalTimer;
    else{
        // if running in Browser, set a global variable.
        let _global = typeof window === 'object' && window.self === window && window ||
                    typeof self === 'object' && self.self === self && self ||
                    typeof global === 'object' && global.global === global && global;

        _global.MusicalTimer = MusicalTimer;
    }

})()


